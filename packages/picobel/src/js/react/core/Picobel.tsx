import classnames from "classnames";
import React, { useEffect, useMemo, useRef, useSyncExternalStore } from "react";

import { getFileName } from "../../utils/helpers";
import * as Components from "../components/";
import { usePicobel } from "./provider";
import { TrackProvider } from "./trackContext";

export interface PicobelProps {
    src: string;
    id?: string;
    className?: string;
    theme?: string;
    children?: React.ReactNode;
    title?: string;
    artist?: string;
}

export const Picobel: React.FC<PicobelProps> = ({
    src,
    id: providedId,
    title: providedTitle,
    theme,
    artist,
    className = "",
    children
}) => {
    const id = providedId || src;
    const title = providedTitle || getFileName(src);

    // Memoized so the register effect below can list it as a dependency
    // without re-registering on every render.
    const metadata = useMemo(() => ({ title, artist }), [title, artist]);

    // Audio element reference
    const audioRef = useRef<HTMLAudioElement>(null);

    // Get Picobel context
    const context = usePicobel();

    if (!context) {
        throw new Error("Picobel must be used within a PicobelProvider");
    }

    const namespace = theme || context.namespace;

    // Register with context on mount and whenever the track's identity
    // changes. The cleanup pauses via our own ref: this component owns the
    // <audio> element, so it doesn't need to reach into provider state
    // (which a cleanup closure would only ever see a stale copy of).
    useEffect(() => {
        const audioEl = audioRef.current;
        context.registerTrack({ id, audioRef, src, metadata, namespace });

        return () => {
            audioEl?.pause();
            context.unregisterTrack(id);
        };
    }, [context, id, src, metadata, namespace]);

    // Subscribe to this track's slice of the store — re-renders only
    // when OUR track's state object changes. Before the mount effect has
    // registered the track there is no state yet: treat as still loading.
    const track = useSyncExternalStore(context.store.subscribe, () =>
        context.store.getState().tracks[id]
    );
    const isPlaying = track?.isPlaying ?? false;
    const fileStatus = track?.fileStatus ?? "pending";

    return (
        <div
            className={classnames(
                "picobel",
                namespace,
                { ["loading"]: fileStatus === "pending" },
                { ["error"]: fileStatus === "error" },
                { ["playing"]: isPlaying },
                className
            )}
        >
            <audio ref={audioRef} src={src} />
            <TrackProvider value={{ trackKey: id }}>
                {!children && (
                    <>
                        <Components.PlayPause />
                        <div className={`${namespace}__wrapper--mute-volume`}>
                            <Components.Mute />
                            <Components.Volume />
                        </div>
                        <div className={`${namespace}__wrapper--title-artist`}>
                            <Components.Title />
                            <Components.Artist />
                        </div>
                        <div
                            className={`${namespace}__wrapper--timer-progress-duration`}
                        >
                            <Components.CurrentTime />
                            <Components.Progress />
                            <Components.Duration />
                        </div>
                    </>
                )}
                {children}
            </TrackProvider>
        </div>
    );
};

export default Picobel;
