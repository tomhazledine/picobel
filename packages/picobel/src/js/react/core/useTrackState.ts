import { useSyncExternalStore } from "react";

import { usePicobel } from "./provider";
import { useTrackContext } from "./trackContext";

// Stable no-op subscription for the "no provider" error path — hooks
// must be called unconditionally, so we always call
// useSyncExternalStore even when there's nothing to subscribe to.
const subscribeToNothing = () => () => {};

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

    // Subscribe to THIS track's slice of the store. useSyncExternalStore
    // re-runs getSnapshot on every store change but only re-renders the
    // component when the snapshot itself (compared with Object.is)
    // differs — other tracks' updates leave our snapshot untouched, so
    // idle players stay idle.
    const trackState = useSyncExternalStore(
        context ? context.store.subscribe : subscribeToNothing,
        () =>
            context && trackKey
                ? context.store.getState().tracks[trackKey]
                : undefined
    );

    if (!context) {
        console.error(`Picobel.${name} must be used within a PicobelProvider`);
        return { valid: false as const };
    }

    if (!trackKey) {
        console.error(
            `Picobel.${name} must be used within an instance of Picobel or with an explicit trackKey prop`
        );
        return { valid: false as const };
    }

    if (!trackState) return { valid: false as const };

    return {
        valid: true as const,
        trackKey,
        context,
        trackState
    };
};
