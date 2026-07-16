import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";

import { convertToPercentage } from "../../utils/helpers";
import { type TrackInfo, type TracksState } from "../core/types";

/**
 * Attach media-event listeners for every registered track.
 *
 * Listeners attach ONCE per (track id, audio element) pair. The effect
 * runs whenever `tracks` changes, but instead of tearing everything down
 * and re-attaching (which, with handlers that themselves update `tracks`,
 * meant every listener churned on every timeupdate), it reconciles:
 * detach only tracks that disappeared or whose element was replaced,
 * attach only new ones — the same "diff against desired state" idea React
 * applies to the DOM.
 *
 * Handlers read the element (not React state) and write exclusively via
 * functional updaters, so they never go stale no matter how long the
 * listeners live.
 */
export const useTrackEventListeners = (
    tracks: TracksState,
    setTracks: Dispatch<SetStateAction<TracksState>>,
    currentlyPlayingId: string | null,
    setCurrentlyPlayingId: Dispatch<SetStateAction<string | null>>
) => {
    // Which element each track id currently has listeners on, plus the
    // AbortController that detaches them all in one call.
    const attached = useRef(
        new Map<
            string,
            { audioEl: HTMLAudioElement; controller: AbortController }
        >()
    );

    useEffect(() => {
        const current = attached.current;

        const attachListeners = (id: string, audioEl: HTMLAudioElement) => {
            // Patch one track's state; a guard drops events that arrive
            // after the track has unregistered.
            const patchTrack = (patch: Partial<TrackInfo>) =>
                setTracks(prev =>
                    prev[id]
                        ? { ...prev, [id]: { ...prev[id], ...patch } }
                        : prev
                );

            const controller = new AbortController();
            const { signal } = controller;

            audioEl.addEventListener(
                "timeupdate",
                () => patchTrack({ currentTime: audioEl.currentTime }),
                { signal }
            );

            audioEl.addEventListener(
                "durationchange",
                () =>
                    patchTrack({
                        duration: audioEl.duration,
                        isLoaded: true,
                        fileStatus: "loaded"
                    }),
                { signal }
            );

            audioEl.addEventListener(
                "ended",
                () => {
                    patchTrack({ isPlaying: false, currentTime: 0 });
                    setCurrentlyPlayingId(cur => (cur === id ? null : cur));
                },
                { signal }
            );

            audioEl.addEventListener(
                "play",
                () => {
                    patchTrack({ isPlaying: true });
                    setCurrentlyPlayingId(id);
                },
                { signal }
            );

            audioEl.addEventListener(
                "pause",
                () => {
                    patchTrack({ isPlaying: false });
                    setCurrentlyPlayingId(cur => (cur === id ? null : cur));
                },
                { signal }
            );

            audioEl.addEventListener(
                "progress",
                () => {
                    const { buffered, duration } = audioEl;
                    const bufferedRanges = Array.from(
                        { length: buffered.length },
                        (_, i) => ({
                            start: convertToPercentage(
                                buffered.start(i),
                                duration
                            ),
                            end: convertToPercentage(buffered.end(i), duration)
                        })
                    );
                    patchTrack({ buffered: bufferedRanges });
                },
                { signal }
            );

            // File-loading lifecycle: loadstart → … → canplay, with error
            // as the failure branch; fileStatus mirrors it for the UI.
            audioEl.addEventListener(
                "loadstart",
                () => patchTrack({ fileStatus: "pending" }),
                { signal }
            );
            audioEl.addEventListener(
                "canplay",
                () => patchTrack({ fileStatus: "loaded" }),
                { signal }
            );
            audioEl.addEventListener(
                "error",
                () => patchTrack({ fileStatus: "error" }),
                { signal }
            );

            current.set(id, { audioEl, controller });
        };

        // Detach tracks that unregistered or whose element was replaced
        for (const [id, entry] of current) {
            const liveElement = tracks[id]?.audioRef?.current;
            if (liveElement !== entry.audioEl) {
                entry.controller.abort();
                current.delete(id);
            }
        }

        // Attach new tracks (or replaced elements)
        Object.entries(tracks).forEach(([id, track]) => {
            const audioEl = track.audioRef?.current;
            if (audioEl && !current.has(id)) {
                attachListeners(id, audioEl);
            }
        });
    }, [tracks, setTracks, setCurrentlyPlayingId]);

    // Detach everything when the provider itself unmounts.
    useEffect(() => {
        const current = attached.current;
        return () => {
            current.forEach(({ controller }) => controller.abort());
            current.clear();
        };
    }, []);
};
