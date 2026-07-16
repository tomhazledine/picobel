import classnames from "classnames";

import { parseTime } from "../../utils/helpers";
import { useTrackState } from "../core/useTrackState";

export const CurrentTime = ({
    trackKey,
    className = ""
}: {
    trackKey?: string;
    className?: string;
}) => {
    const { valid, trackState } = useTrackState({
        trackKey,
        name: "CurrentTime"
    });
    if (!valid) return null;

    return (
        <span
            className={classnames(
                `${trackState.namespace}__current-time`,
                `${trackState.namespace}__timer`,
                className
            )}
        >
            {parseTime(trackState.currentTime)}
        </span>
    );
};
