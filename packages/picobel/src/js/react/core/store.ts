import type { PicobelStore, PicobelStoreState } from "./types";

/**
 * A minimal external store (the pattern under Zustand/Jotai, built on
 * nothing but a Set of listeners). State updates notify subscribers;
 * components subscribe through useSyncExternalStore, which re-renders
 * them only when THEIR snapshot changes — this is what lets one playing
 * track update 4×/second without touching any other player.
 */
export const createPicobelStore = (): PicobelStore => {
    let state: PicobelStoreState = {
        tracks: {},
        currentlyPlayingId: null
    };

    const listeners = new Set<() => void>();

    const getState = () => state;

    const setState = (
        updater: (previous: PicobelStoreState) => PicobelStoreState
    ) => {
        const next = updater(state);
        if (next === state) return;
        state = next;
        listeners.forEach(listener => listener());
    };

    const subscribe = (listener: () => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    return { getState, setState, subscribe };
};
