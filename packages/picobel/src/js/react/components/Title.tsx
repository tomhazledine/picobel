import classnames from "classnames";

import { useTrackState } from "../core/useTrackState";

export const Title = ({
    trackKey,
    className = ""
}: {
    trackKey?: string;
    className?: string;
}) => {
    const { valid, trackState, context } = useTrackState({
        trackKey,
        name: "Artist"
    });
    if (!valid) return null;

    const { title } = trackState.metadata;

    return (
        <span className={classnames(`${context.namespace}__title`, className)}>
            {title}
        </span>
    );
};
