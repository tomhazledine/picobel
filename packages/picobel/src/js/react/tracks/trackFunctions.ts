import { type Dispatch, type SetStateAction } from "react";

import type { RegisterTrackProps, TracksState } from "../core/types";

// Functions for track management
export const createTrackFunctions = (
    tracks: TracksState,
    setTracks: Dispatch<SetStateAction<TracksState>>,
    currentlyPlayingId: string | null,
    setCurrentlyPlayingId: Dispatch<SetStateAction<string | null>>
) => {
    // Helper function to register a new track
    const registerTrack = ({
        id,
        audioRef,
        src,
        metadata,
        namespace
    }: RegisterTrackProps) => {
        setTracks(prev => ({
            ...prev,
            [id]: {
                audioRef,
                src,
                isPlaying: false,
                currentTime: 0,
                duration: 0,
                isLoaded: false,
                volume: 1,
                muted: false,
                metadata,
                namespace,
                buffered: []
            }
        }));
    };

    // Helper function to unregister a track. Uses functional updaters
    // only: this runs from effect cleanups, whose closures see the state
    // from the render that created them — reading `tracks` or
    // `currentlyPlayingId` here would act on stale values. (Pausing the
    // audio is the owning component's job: it holds the ref.)
    const unregisterTrack = (id: string) => {
        setTracks(prev => {
            const newTracks = { ...prev };
            delete newTracks[id];
            return newTracks;
        });

        setCurrentlyPlayingId(current => (current === id ? null : current));
    };

    // Play a specific audio element
    const playTrack = (id: string) => {
        const track = tracks[id];
        if (track?.audioRef.current) {
            // Pause other tracks first
            pauseAllExcept(id);

            // Play this one
            track.audioRef.current.play().catch(error => {
                console.error("Error playing audio:", error);
            });

            // Update state
            setCurrentlyPlayingId(id);
            setTracks(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    isPlaying: true
                }
            }));
        }
    };

    // Pause a specific audio element
    const pauseTrack = (id: string) => {
        const track = tracks[id];
        if (track?.audioRef.current) {
            track.audioRef.current.pause();

            setTracks(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    isPlaying: false
                }
            }));

            // Only reset current track if this was the current track
            if (currentlyPlayingId === id) {
                setCurrentlyPlayingId(null);
            }
        }
    };

    // Toggle play/pause for a specific audio element
    const togglePlayPause = (id: string) => {
        const track = tracks[id];
        if (track?.audioRef.current) {
            if (track.isPlaying) {
                pauseTrack(id);
            } else {
                playTrack(id);
            }
        }
    };

    // Stop a specific audio element (pause and reset to beginning)
    const stopTrack = (id: string) => {
        const track = tracks[id];
        if (track?.audioRef.current) {
            track.audioRef.current.pause();
            track.audioRef.current.currentTime = 0;

            setTracks(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    isPlaying: false,
                    currentTime: 0
                }
            }));

            if (currentlyPlayingId === id) {
                setCurrentlyPlayingId(null);
            }
        }
    };

    // Helper function to pause all tracks except one
    const pauseAllExcept = (exceptId: string) => {
        Object.entries(tracks).forEach(([id, track]) => {
            if (id !== exceptId && track.audioRef.current && track.isPlaying) {
                track.audioRef.current.pause();

                setTracks(prev => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        isPlaying: false
                    }
                }));
            }
        });
    };

    return {
        registerTrack,
        unregisterTrack,
        playTrack,
        pauseTrack,
        togglePlayPause,
        stopTrack,
        pauseAllExcept
    };
};
