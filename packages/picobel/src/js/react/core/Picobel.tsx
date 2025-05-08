import React, { useRef, useEffect } from "react";
import classnames from "classnames";

import { usePicobel } from "./provider";
import { TrackProvider } from "./trackContext";
import { getFileName } from "../../utils/helpers";
import { Artist } from "../components/Artist";
import { PlayPause } from "../components/PlayPause";
import { Title } from "../components/Title";
import { CurrentTime } from "../components/CurrentTime";
import { Duration } from "../components/Duration";

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

    // Register with context when component mounts
    useEffect(() => {
        context.registerTrack({ id, audioRef, src, metadata, namespace });

        return () => {
            context.unregisterTrack(id);
        };
    }, []);

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
                        <PlayPause />
                        <div className={`${namespace}__wrapper--title-artist`}>
                            <Title />
                            <Artist />
                        </div>
                        <div
                            className={`${namespace}__wrapper--timer-progress-duration`}
                        >
                            <CurrentTime />
                            <Duration />
                        </div>
                    </>
                )}
                {children}
            </TrackProvider>
        </div>
    );
};

export default Picobel;
