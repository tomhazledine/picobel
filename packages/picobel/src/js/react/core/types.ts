import type React from "react";

export interface TrackMetadata {
    title?: string;
    artist?: string;
    fileType?: string;
    fileName?: string;
}

export interface BufferedRange {
    start: number;
    end: number;
}

// Define track info type
export interface TrackInfo {
    audioRef: React.RefObject<HTMLAudioElement>;
    src: string;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    isLoaded: boolean;
    volume: number;
    muted: boolean;
    namespace: string;
    buffered: BufferedRange[];
    fileStatus?: "pending" | "buffering" | "loaded" | "error";
    bufferedPercentage?: number;
    metadata?: TrackMetadata;
}

// Define tracks state type
export interface TracksState {
    [id: string]: TrackInfo;
}

export interface RegisterTrackProps {
    id: string;
    audioRef: React.RefObject<HTMLAudioElement>;
    src: string;
    metadata: TrackMetadata;
    namespace: string;
}

// The provider's state lives in an external store so components can
// subscribe to just their own slice (via useSyncExternalStore) instead
// of re-rendering whenever anything anywhere changes.
export interface PicobelStoreState {
    tracks: TracksState;
    currentlyPlayingId: string | null;
}

export interface PicobelStore {
    getState: () => PicobelStoreState;
    setState: (
        updater: (previous: PicobelStoreState) => PicobelStoreState
    ) => void;
    subscribe: (listener: () => void) => () => void;
}

// Define context type
export interface PicobelContextType {
    // Globals
    namespace: string;

    // State store (subscribe via useSyncExternalStore for reactive reads)
    store: PicobelStore;

    // Registration
    registerTrack: (props: RegisterTrackProps) => void;
    unregisterTrack: (id: string) => void;

    // Playback control
    playTrack: (id: string) => void;
    pauseTrack: (id: string) => void;
    togglePlayPause: (id: string) => void;
    stopTrack: (id: string) => void;

    // State getters
    getTrackState: (id: string) => TrackInfo | undefined;
    isTrackPlaying: (id: string) => boolean;
    getCurrentlyPlayingId: () => string | null;
    getAllTracks: () => TracksState;

    // Audio control
    setVolume: (id: string, volume: number) => void;
    setMuted: (id: string, muted: boolean) => void;
    seekTo: (id: string, time: number) => void;

    // Utility functions
    pauseAllExcept: (id: string) => void;
    updateTrackMetadata: (id: string, metadata: Partial<TrackMetadata>) => void;
}

export interface PicobelProviderProps {
    children: React.ReactNode;
    theme?: string;
}
