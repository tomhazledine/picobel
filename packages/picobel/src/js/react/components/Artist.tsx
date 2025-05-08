import classnames from "classnames";

import { usePicobel } from "../core/provider";
import { useTrackContext } from "../core/trackContext";

export const Artist = ({
    trackKey: providedTrackKey,
    className = ""
}: {
    trackKey?: string;
    className?: string;
}) => {
    const context = usePicobel();

    const trackContext = useTrackContext();
    const trackKey = providedTrackKey || trackContext.trackKey;

    if (!context) {
        console.error("Picobel.Artist must be used within a PicobelProvider");
        return null;
    }

    const trackState = context.getTrackState(trackKey);
    if (!trackState) return null;
    const { artist } = trackState.metadata;

    if (!artist) return null;

    return (
        <span className={classnames(`${context.namespace}__artist`, className)}>
            {artist}
        </span>
    );
};
