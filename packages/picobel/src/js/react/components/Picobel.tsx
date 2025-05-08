import React, { useRef, useEffect } from "react";
import classnames from "classnames";

import { usePicobel } from "../core/provider";
import { TrackProvider } from "../core/trackContext";
import { getFileName } from "../../utils/helpers";
import { Artist } from "./Artist";
import { PlayPause } from "./PlayPause";
import { Title } from "./Title";

export interface PicobelProps {
    src: string;
    id?: string;
    className?: string;
    theme?: string;
    children?: React.ReactNode;
}

export const Picobel: React.FC<PicobelProps> = ({
    src,
    id: providedId,
    title: providedTitle,
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

    // Register with context when component mounts
    useEffect(() => {
        context.registerTrack(id, audioRef, src, metadata);

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
                context.namespace,
                { ["loading"]: context.fileStatus === "pending" },
                { ["playing"]: isPlaying },
                className
            )}
        >
            <audio ref={audioRef} src={src} />
            <TrackProvider value={{ trackKey: id }}>
                {!children && (
                    <>
                        <Title />
                        <Artist />
                        <PlayPause />
                    </>
                )}
                {children}
            </TrackProvider>
        </div>
    );
};

export default Picobel;
