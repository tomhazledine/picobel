import classnames from "classnames";
import React, { useEffect,useRef } from "react";

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

    const metadata = {
        title,
        artist
    };

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
        // `context` and `metadata` are rebuilt on every render, so listing
        // them would re-register the track (and reset its state) constantly.
        // Metadata updates have their own path (updateTrackMetadata).
        // TODO(Task 12): a stable context makes this disable unnecessary.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, src, namespace]);

    // Get current player state
    const isPlaying = context.isTrackPlaying(id);

    return (
        <div
            className={classnames(
                "picobel",
                namespace,
                { ["loading"]: context.fileStatus === "pending" },
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
