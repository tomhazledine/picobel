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

    if (!valid) return null;

    // Derived directly from the subscribed track snapshot — mirroring it
    // into local state via an effect (the old approach) only appeared to
    // work because the provider used to re-render everything constantly.
    const isPlaying = trackState.isPlaying;

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
