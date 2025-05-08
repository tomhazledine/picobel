import { useEffect, useState } from "react";
import classnames from "classnames";

import { useTrackState } from "../core/useTrackState";

export const PlayPause = ({
    trackKey: providedTrackKey,
    className
}: {
    trackKey?: string;
    className?: string;
}) => {
    const { valid, trackState, trackKey, context } = useTrackState({
        trackKey: providedTrackKey,
        name: "PlayPause"
    });

    const [isPlaying, setIsPlaying] = useState(
        valid && context.getCurrentlyPlayingId() === trackKey
    );

    useEffect(() => {
        if (valid) {
            setIsPlaying(context.getCurrentlyPlayingId() === trackKey);
        }
    }, [context, valid, trackKey]);

    if (!valid) return null;

    const handleTogglePlay = () => {
        context.togglePlayPause(trackKey);
    };

    return (
        <button
            type="button"
            className={classnames(
                `${trackState.namespace}__play-pause`,
                className,
                { ["playing"]: isPlaying }
            )}
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
        >
            <span className={`${trackState.namespace}__play-pause__text`}>
                {isPlaying ? "Pause" : "Play"}
            </span>
        </button>
    );
};
