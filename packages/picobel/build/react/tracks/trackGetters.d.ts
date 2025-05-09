import { type TrackInfo, type TracksState } from "../core/types";
export declare const createTrackGetters: (tracks: TracksState, currentlyPlayingId: string | null) => {
    getTrackState: (id: string) => TrackInfo | undefined;
    isTrackPlaying: (id: string) => boolean;
    getCurrentlyPlayingId: () => string | null;
    getAllTracks: () => TracksState;
};
