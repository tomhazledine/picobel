import { useEffect, useState } from "react";
import classnames from "classnames";

import { useTrackState } from "../core/useTrackState";

export const Mute = ({
    trackKey: providedTrackKey,
    className
}: {
    trackKey?: string;
    className?: string;
}) => {
    const { valid, trackState, trackKey, context } = useTrackState({
        trackKey: providedTrackKey,
        name: "Mute"
    });

    const [isMuted, setIsMuted] = useState(trackState?.muted || false);

    useEffect(() => {
        if (valid) {
            setIsMuted(trackState.muted);
        }
    }, [trackState, valid]);

    if (!valid) return null;

    const handleToggleMute = () => {
        context.setMuted(trackKey, !isMuted);
    };

    return (
        <button
            type="button"
            className={classnames(`${trackState.namespace}__mute`, className, {
                ["muted"]: isMuted
            })}
            onClick={handleToggleMute}
            aria-label={isMuted ? "Mute" : "Unmute"}
        >
            {isMuted ? "Mute" : "Unmute"}
        </button>
    );
};
