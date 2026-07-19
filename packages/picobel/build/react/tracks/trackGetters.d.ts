import type { PicobelStore, TrackInfo, TracksState } from "../core/types";
export declare const createTrackGetters: (store: PicobelStore) => {
    getTrackState: (id: string) => TrackInfo | undefined;
    isTrackPlaying: (id: string) => boolean;
    getCurrentlyPlayingId: () => string | null;
    getAllTracks: () => TracksState;
};
