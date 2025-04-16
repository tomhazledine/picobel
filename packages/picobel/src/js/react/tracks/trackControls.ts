import { type Dispatch, type SetStateAction } from "react";
import { type TracksState, type TrackMetadata } from "../core/types";

// Functions for audio controls
export const createTrackControls = (
    tracks: TracksState,
    setTracks: Dispatch<SetStateAction<TracksState>>
) => {
    // Set volume for a specific audio element
    const setVolume = (id: string, volume: number) => {
        const track = tracks[id];
        if (track?.audioRef.current) {
            const clampedVolume = Math.max(0, Math.min(1, volume));
            track.audioRef.current.volume = clampedVolume;

            setTracks(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    volume: clampedVolume
                }
            }));
        }
    };

    // Set muted state for a specific audio element
    const setMuted = (id: string, muted: boolean) => {
        const track = tracks[id];
        if (track?.audioRef.current) {
            track.audioRef.current.muted = muted;

            setTracks(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    muted
                }
            }));
        }
    };

    // Seek to a specific time in a specific audio element
    const seekTo = (id: string, time: number) => {
        const track = tracks[id];
        if (track?.audioRef.current) {
            track.audioRef.current.currentTime = time;

            setTracks(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    currentTime: time
                }
            }));
        }
    };

    // Update metadata for a specific track
    const updateTrackMetadata = (
        id: string,
        metadata: Partial<TrackMetadata>
    ) => {
        setTracks(prev => {
            if (!prev[id]) return prev;

            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    metadata: {
                        ...prev[id].metadata,
                        ...metadata
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
