import type { PicobelStore, RegisterTrackProps } from "../core/types";

// Functions for track management. Built once per store: every function
// reads the store's CURRENT state when called, so none of them can go
// stale — unlike closures over render-scoped state.
export const createTrackFunctions = (store: PicobelStore) => {
    // Helper function to register a new track
    const registerTrack = ({
        id,
        audioRef,
        src,
        metadata,
        namespace
    }: RegisterTrackProps) => {
        store.setState(prev => ({
            ...prev,
            tracks: {
                ...prev.tracks,
                [id]: {
                    audioRef,
                    src,
                    isPlaying: false,
                    currentTime: 0,
                    duration: 0,
                    isLoaded: false,
                    volume: 1,
                    muted: false,
                    fileStatus: "pending" as const,
                    metadata,
                    namespace,
                    buffered: []
                }
            }
        }));
    };

    // Helper function to unregister a track. (Pausing the audio is the
    // owning component's job: it holds the ref.)
    const unregisterTrack = (id: string) => {
        store.setState(prev => {
            const tracks = { ...prev.tracks };
            delete tracks[id];
            return {
                tracks,
                currentlyPlayingId:
                    prev.currentlyPlayingId === id
                        ? null
                        : prev.currentlyPlayingId
            };
        });
    };

    // Play a specific audio element
    const playTrack = (id: string) => {
        const track = store.getState().tracks[id];
        if (track?.audioRef.current) {
            // Pause other tracks first
            pauseAllExcept(id);

            // Play this one
            track.audioRef.current.play().catch(error => {
                console.error("Error playing audio:", error);
            });

            store.setState(prev => ({
                currentlyPlayingId: id,
                tracks: {
                    ...prev.tracks,
                    [id]: { ...prev.tracks[id], isPlaying: true }
                }
            }));
        }
    };

    // Pause a specific audio element
    const pauseTrack = (id: string) => {
        const track = store.getState().tracks[id];
        if (track?.audioRef.current) {
            track.audioRef.current.pause();

            store.setState(prev => ({
                currentlyPlayingId:
                    prev.currentlyPlayingId === id
                        ? null
                        : prev.currentlyPlayingId,
                tracks: {
                    ...prev.tracks,
                    [id]: { ...prev.tracks[id], isPlaying: false }
                }
            }));
        }
    };

    // Toggle play/pause for a specific audio element
    const togglePlayPause = (id: string) => {
        const track = store.getState().tracks[id];
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
        const track = store.getState().tracks[id];
        if (track?.audioRef.current) {
            track.audioRef.current.pause();
            track.audioRef.current.currentTime = 0;

            store.setState(prev => ({
                currentlyPlayingId:
                    prev.currentlyPlayingId === id
                        ? null
                        : prev.currentlyPlayingId,
                tracks: {
                    ...prev.tracks,
                    [id]: {
                        ...prev.tracks[id],
                        isPlaying: false,
                        currentTime: 0
                    }
                }
            }));
        }
    };

    // Helper function to pause all tracks except one
    const pauseAllExcept = (exceptId: string) => {
        const { tracks } = store.getState();
        Object.entries(tracks).forEach(([id, track]) => {
            if (id !== exceptId && track.audioRef.current && track.isPlaying) {
                track.audioRef.current.pause();

                store.setState(prev => ({
                    ...prev,
                    tracks: {
                        ...prev.tracks,
                        [id]: { ...prev.tracks[id], isPlaying: false }
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
