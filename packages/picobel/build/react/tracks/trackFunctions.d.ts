import { type Dispatch, type SetStateAction } from "react";
import type { TracksState, RegisterTrackProps } from "../core/types";
export declare const createTrackFunctions: (tracks: TracksState, setTracks: Dispatch<SetStateAction<TracksState>>, currentlyPlayingId: string | null, setCurrentlyPlayingId: Dispatch<SetStateAction<string | null>>) => {
    registerTrack: ({ id, audioRef, src, metadata, namespace }: RegisterTrackProps) => void;
    unregisterTrack: (id: string) => void;
    playTrack: (id: string) => void;
    pauseTrack: (id: string) => void;
    togglePlayPause: (id: string) => void;
    stopTrack: (id: string) => void;
    pauseAllExcept: (exceptId: string) => void;
};
