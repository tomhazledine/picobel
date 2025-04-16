import { type TrackInfo, type TracksState } from "../core/types";

// Functions for state getters
export const createTrackGetters = (
    tracks: TracksState,
    currentlyPlayingId: string | null
) => {
    // Get state for a specific track
    const getTrackState = (id: string): TrackInfo | undefined => {
        return tracks[id];
    };

    // Check if a track is currently playing
    const isTrackPlaying = (id: string): boolean => {
        const track = tracks[id];
        return !!track?.isPlaying;
    };

    // Get the ID of the currently playing track
    const getCurrentlyPlayingId = (): string | null => {
        return currentlyPlayingId;
    };

    // Get all tracks
    const getAllTracks = (): TracksState => {
        return tracks;
    };

    return {
        getTrackState,
        isTrackPlaying,
        getCurrentlyPlayingId,
        getAllTracks
    };
};
