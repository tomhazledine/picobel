import { useEffect, useState } from "react";
import classnames from "classnames";

import { useTrackState } from "../core/useTrackState";
import { Range } from "../core/Range";

export const Progress = ({
    trackKey: providedTrackKey,
    className
}: {
    trackKey?: string;
    className?: string;
}) => {
    const { valid, trackState, trackKey, context } = useTrackState({
        trackKey: providedTrackKey,
        name: "Progress"
    });

    if (!valid) return null;

    const handleDurationChange = e => {
        const elapsed = Number(e.target.value);
        if (isNaN(elapsed)) return;
        context.seekTo(trackKey, elapsed);
    };

    return (
        <Range
            label="Progress"
            onChange={handleDurationChange}
            namespace={`${trackState.namespace}__progress`}
            min={0}
            max={trackState.duration}
            value={trackState.currentTime}
        />
    );
};
