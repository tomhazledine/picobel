import React, { createContext, useContext, useState } from "react";
import type {
    PicobelContextType,
    PicobelProviderProps,
    TracksState
} from "./types";
import { createTrackFunctions } from "../tracks/trackFunctions";
import { createTrackControls } from "../tracks/trackControls";
import { createTrackGetters } from "../tracks/trackGetters";
import { useTrackEventListeners } from "../tracks/trackListeners";

// Create the context with default value
const PicobelContext = createContext<PicobelContextType | null>(null);

export const PicobelProvider: React.FC<PicobelProviderProps> = ({
    theme = "picobel",
    children
}) => {
    // Tracks registry
    const [tracks, setTracks] = useState<TracksState>({});
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
        null
    );

    // Create function groups
    const trackFunctions = createTrackFunctions(
        tracks,
        setTracks,
        currentlyPlayingId,
        setCurrentlyPlayingId
    );
    const trackControls = createTrackControls(tracks, setTracks);
    const trackGetters = createTrackGetters(tracks, currentlyPlayingId);

    // Set up event listeners
    useTrackEventListeners(
        tracks,
        setTracks,
        currentlyPlayingId,
        setCurrentlyPlayingId
    );

    // Combine all functions into the context value
    const contextValue: PicobelContextType = {
        ...trackFunctions,
        ...trackControls,
        ...trackGetters,
        namespace: theme
    };

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
