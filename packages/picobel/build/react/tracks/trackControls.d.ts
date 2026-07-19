import type { PicobelStore, TrackMetadata } from "../core/types";
export declare const createTrackControls: (store: PicobelStore) => {
    setVolume: (id: string, volume: number) => void;
    setMuted: (id: string, muted: boolean) => void;
    seekTo: (id: string, time: number) => void;
    updateTrackMetadata: (id: string, metadata: Partial<TrackMetadata>) => void;
};
