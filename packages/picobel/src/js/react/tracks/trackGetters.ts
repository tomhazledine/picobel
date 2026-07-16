import type { PicobelStore, TrackInfo, TracksState } from "../core/types";

// Imperative state getters. These read the store's CURRENT state — fine
// inside event handlers and effects. For reads during render, subscribe
// instead (useTrackState / useSyncExternalStore on context.store) or the
// component won't re-render when the value changes.
export const createTrackGetters = (store: PicobelStore) => {
    // Get state for a specific track
    const getTrackState = (id: string): TrackInfo | undefined => {
        return store.getState().tracks[id];
    };

    // Check if a track is currently playing
    const isTrackPlaying = (id: string): boolean => {
        return !!store.getState().tracks[id]?.isPlaying;
    };

    // Get the ID of the currently playing track
    const getCurrentlyPlayingId = (): string | null => {
        return store.getState().currentlyPlayingId;
    };

    // Get all tracks
    const getAllTracks = (): TracksState => {
        return store.getState().tracks;
    };

    return {
        getTrackState,
        isTrackPlaying,
        getCurrentlyPlayingId,
        getAllTracks
    };
};
