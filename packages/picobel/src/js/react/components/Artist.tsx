import classnames from "classnames";

import { useTrackState } from "../core/useTrackState";

export const Artist = ({
    trackKey,
    className = ""
}: {
    trackKey?: string;
    className?: string;
}) => {
    const { valid, trackState } = useTrackState({
        trackKey,
        name: "Artist"
    });
    if (!valid) return null;

    const { artist } = trackState.metadata;

    if (!artist) return null;

    return (
        <span
            className={classnames(`${trackState.namespace}__artist`, className)}
        >
            {artist}
        </span>
    );
};
