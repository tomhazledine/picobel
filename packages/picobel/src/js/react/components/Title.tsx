import classnames from "classnames";

import { useTrackState } from "../core/useTrackState";

export const Title = ({
    trackKey,
    className = ""
}: {
    trackKey?: string;
    className?: string;
}) => {
    const { valid, trackState } = useTrackState({
        trackKey,
        name: "Title"
    });
    if (!valid) return null;

    const { title } = trackState.metadata;

    return (
        <span
            className={classnames(`${trackState.namespace}__title`, className)}
        >
            {title}
        </span>
    );
};
