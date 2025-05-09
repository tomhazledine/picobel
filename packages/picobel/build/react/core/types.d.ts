import React from "react";
export interface TrackMetadata {
    title?: string;
    artist?: string;
    fileType?: string;
    fileName?: string;
}
export interface TrackInfo {
    audioRef: React.RefObject<HTMLAudioElement>;
    src: string;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    isLoaded: boolean;
    volume: number;
    muted: boolean;
    fileStatus?: "pending" | "buffering" | "loaded" | "error";
    bufferedPercentage?: number;
    metadata?: TrackMetadata;
}
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
export interface PicobelContextType {
    namespace: string;
    registerTrack: (props: RegisterTrackProps) => void;
    unregisterTrack: (id: string) => void;
    playTrack: (id: string) => void;
    pauseTrack: (id: string) => void;
    togglePlayPause: (id: string) => void;
    stopTrack: (id: string) => void;
    getTrackState: (id: string) => TrackInfo | undefined;
    isTrackPlaying: (id: string) => boolean;
    getCurrentlyPlayingId: () => string | null;
    getAllTracks: () => TracksState;
    setVolume: (id: string, volume: number) => void;
    setMuted: (id: string, muted: boolean) => void;
    seekTo: (id: string, time: number) => void;
    pauseAllExcept: (id: string) => void;
    updateTrackMetadata: (id: string, metadata: Partial<TrackMetadata>) => void;
}
export interface PicobelProviderProps {
    children: React.ReactNode;
    theme?: string;
}
