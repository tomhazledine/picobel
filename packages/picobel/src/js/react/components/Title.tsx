import classnames from "classnames";

import { usePicobel } from "../core/provider";
import { useTrackContext } from "../core/trackContext";

export const Title = ({
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
        console.error("Picobel.Title must be used within a PicobelProvider");
        return null;
    }

    const trackState = context.getTrackState(trackKey);
    if (!trackState) return null;
    const { metadata } = trackState;
    const { title } = metadata;

    return (
        <span className={classnames(`${context.namespace}__title`, className)}>
            {title}
        </span>
    );
};
