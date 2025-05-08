import { useEffect, useState } from "react";
import classnames from "classnames";

import { usePicobel } from "../core/provider";
import { useTrackContext } from "../core/trackContext";

export const PlayPause = ({
    trackKey: providedTrackKey,
    className
}: {
    trackKey?: string;
    className?: string;
}) => {
    const context = usePicobel();

    const trackContext = useTrackContext();
    const trackKey = !trackContext ? providedTrackKey : trackContext.trackKey;

    if (!context) {
        console.error(
            "Picobel.PlayPause must be used within a PicobelProvider"
        );
        return null;
    }

    if (!trackKey) {
        console.error(
            "Picobel.PlayPause must be used within an instance of Picobel or with an explicit trackKey prop"
        );
        return null;
    }

    const [isPlaying, setIsPlaying] = useState(
        context.getCurrentlyPlayingId() === trackKey
    );

    const handleTogglePlay = () => {
        context.togglePlayPause(trackKey);
    };

    useEffect(() => {
        setIsPlaying(context.getCurrentlyPlayingId() === trackKey);
    }, [context]);

    return (
        <button
            type="button"
            className={classnames(
                `${context.namespace}__play-pause`,
                className
            )}
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
        >
            <span className={`${context.namespace}__play-pause__text`}>
                {isPlaying ? "Pause" : "Play"}
            </span>
        </button>
    );
};
