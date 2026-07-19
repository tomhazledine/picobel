import { type PicobelStore } from "../core/types";
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
export declare const useTrackEventListeners: (store: PicobelStore) => void;
