import { type Dispatch, type SetStateAction, useEffect } from "react";
import { type TracksState } from "../core/types";
import { convertToPercentage } from "../../utils/helpers";

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

            // Progress handler
            const handleProgress = e => {
                const buffered = e.target.buffered;

                // Array of buffered ranges, in percentage
                const bufferedRanges = Array.from(
                    { length: buffered.length },
                    (_, i) => {
                        const start = convertToPercentage(
                            buffered.start(i),
                            audioEl.duration
                        );
                        const end = convertToPercentage(
                            buffered.end(i),
                            audioEl.duration
                        );
                        return { start, end };
                    }
                );
                setTracks(prev => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        buffered: bufferedRanges
                    }
                }));
            };

            // Add event listeners
            audioEl.addEventListener("timeupdate", handleTimeUpdate);
            audioEl.addEventListener("durationchange", handleDurationChange);
            audioEl.addEventListener("ended", handleEnded);
            audioEl.addEventListener("play", handlePlay);
            audioEl.addEventListener("pause", handlePause);
            audioEl.addEventListener("progress", handleProgress);

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
                    audioEl.removeEventListener("progress", handleProgress);
                }
            });
        });

        // Return combined cleanup function
        return () => {
            cleanupListeners.forEach(cleanup => cleanup());
        };
    }, [tracks, currentlyPlayingId, setTracks, setCurrentlyPlayingId]);
};
