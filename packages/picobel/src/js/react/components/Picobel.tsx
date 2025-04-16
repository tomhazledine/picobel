import React, { useRef, useEffect, useId } from "react";
import { usePicobel } from "../core/provider";

export interface PicobelProps {
    src: string;
    id?: string;
    className?: string;
}

export const Picobel: React.FC<PicobelProps> = ({
    src,
    id: providedId,
    className = ""
}) => {
    // Generate a unique ID if one wasn't provided
    const generatedId = useId();
    const id = providedId || `picobel-${generatedId}`;

    // Audio element reference
    const audioRef = useRef<HTMLAudioElement>(null);

    // Get Picobel context
    const context = usePicobel();

    if (!context) {
        throw new Error("Picobel must be used within a PicobelProvider");
    }

    // Register with context when component mounts
    useEffect(() => {
        context.registerTrack(id, audioRef, src);

        return () => {
            context.unregisterTrack(id);
        };
    }, []);

    // Get current player state
    const isPlaying = context.isTrackPlaying(id);

    // Handle play/pause
    const togglePlay = () => {
        context.togglePlayPause(id);
    };

    return (
        <div className={`picobel-player ${className}`}>
            <audio ref={audioRef} src={src} />
            <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? "Pause" : "Play"}
            </button>
        </div>
    );
};

export default Picobel;
