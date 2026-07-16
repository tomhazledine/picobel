import type { PicobelStore, TrackMetadata } from "../core/types";

// Functions for audio controls
export const createTrackControls = (store: PicobelStore) => {
    // Set volume for a specific audio element
    const setVolume = (id: string, volume: number) => {
        const track = store.getState().tracks[id];
        if (track?.audioRef.current) {
            const clampedVolume = Math.max(0, Math.min(1, volume));
            track.audioRef.current.volume = clampedVolume;

            store.setState(prev => ({
                ...prev,
                tracks: {
                    ...prev.tracks,
                    [id]: { ...prev.tracks[id], volume: clampedVolume }
                }
            }));
        }
    };

    // Set muted state for a specific audio element
    const setMuted = (id: string, muted: boolean) => {
        const track = store.getState().tracks[id];
        if (track?.audioRef.current) {
            track.audioRef.current.muted = muted;

            store.setState(prev => ({
                ...prev,
                tracks: {
                    ...prev.tracks,
                    [id]: { ...prev.tracks[id], muted }
                }
            }));
        }
    };

    // Seek to a specific time in a specific audio element
    const seekTo = (id: string, time: number) => {
        const track = store.getState().tracks[id];
        if (track?.audioRef.current) {
            track.audioRef.current.currentTime = time;

            store.setState(prev => ({
                ...prev,
                tracks: {
                    ...prev.tracks,
                    [id]: { ...prev.tracks[id], currentTime: time }
                }
            }));
        }
    };

    // Update metadata for a specific track
    const updateTrackMetadata = (
        id: string,
        metadata: Partial<TrackMetadata>
    ) => {
        store.setState(prev => {
            if (!prev.tracks[id]) return prev;

            return {
                ...prev,
                tracks: {
                    ...prev.tracks,
                    [id]: {
                        ...prev.tracks[id],
                        metadata: {
                            ...prev.tracks[id].metadata,
                            ...metadata
                        }
                    }
                }
            };
        });
    };

    return {
        setVolume,
        setMuted,
        seekTo,
        updateTrackMetadata
    };
};
