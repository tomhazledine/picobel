import React, { createContext, useContext, useMemo, useRef } from "react";

import { createTrackControls } from "../tracks/trackControls";
import { createTrackFunctions } from "../tracks/trackFunctions";
import { createTrackGetters } from "../tracks/trackGetters";
import { useTrackEventListeners } from "../tracks/trackListeners";
import { createPicobelStore } from "./store";
import type { PicobelContextType, PicobelProviderProps } from "./types";

// Create the context with default value
const PicobelContext = createContext<PicobelContextType | null>(null);

export const PicobelProvider: React.FC<PicobelProviderProps> = ({
    theme = "picobel",
    children
}) => {
    // Track state lives in an external store, NOT in useState: state
    // that changes ~4×/second while audio plays must not be held where
    // every change re-renders the provider and (via a fresh context
    // value) every consumer. Components subscribe to their own slice
    // through useSyncExternalStore instead.
    const storeRef = useRef<ReturnType<typeof createPicobelStore> | null>(
        null
    );
    if (!storeRef.current) {
        storeRef.current = createPicobelStore();
    }
    const store = storeRef.current;

    // Set up event listeners (subscribes to the store, renderless)
    useTrackEventListeners(store);

    // The context value is memoized and only changes with the theme —
    // context consumers re-render on context IDENTITY change, so keeping
    // this stable is what stops the provider re-rendering the world.
    const contextValue: PicobelContextType = useMemo(
        () => ({
            ...createTrackFunctions(store),
            ...createTrackControls(store),
            ...createTrackGetters(store),
            namespace: theme,
            store
        }),
        [store, theme]
    );

    return (
        <PicobelContext.Provider value={contextValue}>
            {children}
        </PicobelContext.Provider>
    );
};

// Custom hook to use the context
export const usePicobel = () => {
    return useContext(PicobelContext);
};

export default PicobelContext;
