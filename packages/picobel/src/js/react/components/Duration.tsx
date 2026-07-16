import classnames from "classnames";

import { parseTime } from "../../utils/helpers";
import { useTrackState } from "../core/useTrackState";

export const Duration = ({
    trackKey,
    className = ""
}: {
    trackKey?: string;
    className?: string;
}) => {
    const { valid, trackState } = useTrackState({
        trackKey,
        name: "Duration"
    });
    if (!valid) return null;

    return (
        <span
            className={classnames(
                `${trackState.namespace}__duration`,
                className
            )}
        >
            {trackState.duration ? parseTime(trackState.duration) : "-:--"}
        </span>
    );
};
