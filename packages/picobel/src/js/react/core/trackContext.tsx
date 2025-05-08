import { createContext, useContext } from "react";

interface TrackContextType {
    trackKey: string;
}

const TrackContext = createContext<TrackContextType | null>(null);

export const useTrackContext = () => useContext(TrackContext);

export const TrackProvider = TrackContext.Provider;
