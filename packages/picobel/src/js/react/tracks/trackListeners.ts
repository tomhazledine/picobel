import { type Dispatch, type SetStateAction, useEffect } from "react";
import { type TracksState } from "../core/types";

export const useTrackEventListeners = (
    tracks: TracksState,
    setTracks: Dispatch<SetStateAction<TracksState>>,
    currentlyPlayingId: string | null,
    setCurrentlyPlayingId: Dispatch<SetStateAction<string | null>>
) => {
    // Set up event listeners for all tracks
    useEffect(() => {
        // Clean up function to remove all event listeners
        const cleanupListeners: (() => void)[] = [];

        // Set up event listeners for each track
        Object.entries(tracks).forEach(([id, track]) => {
            const audioEl = track.audioRef.current;
            if (!audioEl) return;

            // Time update handler
            const handleTimeUpdate = () => {
                setTracks(prev => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        currentTime: audioEl.currentTime
                    }
                }));
            };

            // Duration change handler
            const handleDurationChange = () => {
                setTracks(prev => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        duration: audioEl.duration,
                        isLoaded: true
                    }
                }));
            };

            // Ended handler
            const handleEnded = () => {
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
            };

            // Play handler
            const handlePlay = () => {
                setTracks(prev => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        isPlaying: true
                    }
                }));

                setCurrentlyPlayingId(id);
            };

            // Pause handler
            const handlePause = () => {
                setTracks(prev => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        isPlaying: false
                    }
                }));

                if (currentlyPlayingId === id) {
                    setCurrentlyPlayingId(null);
                }
            };

            // Add event listeners
            audioEl.addEventListener("timeupdate", handleTimeUpdate);
            audioEl.addEventListener("durationchange", handleDurationChange);
            audioEl.addEventListener("ended", handleEnded);
            audioEl.addEventListener("play", handlePlay);
            audioEl.addEventListener("pause", handlePause);

            // Add cleanup function for this track
            cleanupListeners.push(() => {
                if (audioEl) {
                    audioEl.removeEventListener("timeupdate", handleTimeUpdate);
                    audioEl.removeEventListener(
                        "durationchange",
                        handleDurationChange
                    );
                    audioEl.removeEventListener("ended", handleEnded);
                    audioEl.removeEventListener("play", handlePlay);
                    audioEl.removeEventListener("pause", handlePause);
                }
            });
        });

        // Return combined cleanup function
        return () => {
            cleanupListeners.forEach(cleanup => cleanup());
        };
    }, [tracks, currentlyPlayingId, setTracks, setCurrentlyPlayingId]);
};
