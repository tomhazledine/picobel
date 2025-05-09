import { type Dispatch, type SetStateAction } from "react";
import { type TracksState } from "../core/types";
export declare const useTrackEventListeners: (tracks: TracksState, setTracks: Dispatch<SetStateAction<TracksState>>, currentlyPlayingId: string | null, setCurrentlyPlayingId: Dispatch<SetStateAction<string | null>>) => void;
