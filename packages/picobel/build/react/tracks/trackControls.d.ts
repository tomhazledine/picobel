import { type Dispatch, type SetStateAction } from "react";
import { type TracksState, type TrackMetadata } from "../core/types";
export declare const createTrackControls: (tracks: TracksState, setTracks: Dispatch<SetStateAction<TracksState>>) => {
    setVolume: (id: string, volume: number) => void;
    setMuted: (id: string, muted: boolean) => void;
    seekTo: (id: string, time: number) => void;
    updateTrackMetadata: (id: string, metadata: Partial<TrackMetadata>) => void;
};
