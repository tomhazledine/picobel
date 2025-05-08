import { usePicobel } from "./provider";
import { useTrackContext } from "./trackContext";

export const useTrackState = ({
    trackKey: providedTrackKey,
    name
}: {
    trackKey?: string;
    name: string;
}) => {
    const context = usePicobel();

    const trackContext = useTrackContext();
    const trackKey = !trackContext ? providedTrackKey : trackContext.trackKey;

    if (!context) {
        console.error(`Picobel.${name} must be used within a PicobelProvider`);
        return { valid: false };
    }

    if (!trackKey) {
        console.error(
            `Picobel.${name} must be used within an instance of Picobel or with an explicit trackKey prop`
        );
        return { valid: false };
    }

    const trackState = context.getTrackState(trackKey);

    if (!trackState) return { valid: false };

    return {
        valid: true,
        trackKey,
        context,
        trackState: trackState
    };
};
