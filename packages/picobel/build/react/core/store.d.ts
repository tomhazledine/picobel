import type { PicobelStore } from "./types";
/**
 * A minimal external store (the pattern under Zustand/Jotai, built on
 * nothing but a Set of listeners). State updates notify subscribers;
 * components subscribe through useSyncExternalStore, which re-renders
 * them only when THEIR snapshot changes — this is what lets one playing
 * track update 4×/second without touching any other player.
 */
export declare const createPicobelStore: () => PicobelStore;
