import { useEffect } from "react";

import { convertToPercentage } from "../../utils/helpers";
import { type PicobelStore, type TrackInfo } from "../core/types";

/**
 * Attach media-event listeners for every registered track.
 *
 * Listeners attach ONCE per (track id, audio element) pair. Registration
 * changes are observed by subscribing to the store directly — no React
 * re-renders involved — and reconciled: detach only tracks that
 * disappeared or whose element was replaced, attach only new ones. The
 * same "diff against desired state" idea React applies to the DOM.
 *
 * Handlers read the audio element (not captured state) and write through
 * store.setState, so they never go stale however long they live.
 */
export const useTrackEventListeners = (store: PicobelStore) => {
    useEffect(() => {
        const attached = new Map<
            string,
            { audioEl: HTMLAudioElement; controller: AbortController }
        >();

        const attachListeners = (id: string, audioEl: HTMLAudioElement) => {
            // Patch one track's state; a guard drops events that arrive
            // after the track has unregistered.
            const patchTrack = (patch: Partial<TrackInfo>) =>
                store.setState(prev =>
                    prev.tracks[id]
                        ? {
                              ...prev,
                              tracks: {
                                  ...prev.tracks,
                                  [id]: { ...prev.tracks[id], ...patch }
                              }
                          }
                        : prev
                );

            const clearCurrentIfOurs = () =>
                store.setState(prev =>
                    prev.currentlyPlayingId === id
                        ? { ...prev, currentlyPlayingId: null }
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
                    clearCurrentIfOurs();
                },
                { signal }
            );

            audioEl.addEventListener(
                "play",
                () => {
                    store.setState(prev =>
                        prev.tracks[id]
                            ? {
                                  currentlyPlayingId: id,
                                  tracks: {
                                      ...prev.tracks,
                                      [id]: {
                                          ...prev.tracks[id],
                                          isPlaying: true
                                      }
                                  }
                              }
                            : prev
                    );
                },
                { signal }
            );

            audioEl.addEventListener(
                "pause",
                () => {
                    patchTrack({ isPlaying: false });
                    clearCurrentIfOurs();
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

            attached.set(id, { audioEl, controller });
        };

        const reconcile = () => {
            const { tracks } = store.getState();

            // Detach tracks that unregistered or whose element was replaced
            for (const [id, entry] of attached) {
                const liveElement = tracks[id]?.audioRef?.current;
                if (liveElement !== entry.audioEl) {
                    entry.controller.abort();
                    attached.delete(id);
                }
            }

            // Attach new tracks (or replaced elements)
            Object.entries(tracks).forEach(([id, track]) => {
                const audioEl = track.audioRef?.current;
                if (audioEl && !attached.has(id)) {
                    attachListeners(id, audioEl);
                }
            });
        };

        reconcile();
        const unsubscribe = store.subscribe(reconcile);

        return () => {
            unsubscribe();
            attached.forEach(({ controller }) => controller.abort());
            attached.clear();
        };
    }, [store]);
};
