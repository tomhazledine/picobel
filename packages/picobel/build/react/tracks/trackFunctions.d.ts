import type { PicobelStore, RegisterTrackProps } from "../core/types";
export declare const createTrackFunctions: (store: PicobelStore) => {
    registerTrack: ({ id, audioRef, src, metadata, namespace }: RegisterTrackProps) => void;
    unregisterTrack: (id: string) => void;
    playTrack: (id: string) => void;
    pauseTrack: (id: string) => void;
    togglePlayPause: (id: string) => void;
    stopTrack: (id: string) => void;
    pauseAllExcept: (exceptId: string) => void;
};
