import React, { useRef } from "react";
import { Options } from "../types";

type PicobelProps = React.AudioHTMLAttributes<HTMLAudioElement> & Options;

const Picobel = ({ src, title, artist, controls, ...props }: PicobelProps) => {
    console.log('initializing ref')
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // useEffect(() => {
    //     if (!audioRef.current) {
    //         audioRef.current = new Audio(src);
    //     }

    //     const handleLoadedMetadata = () => {
    //         console.log("loaded metadata");
    //         console.log({ duration: audioRef.current?.duration });
    //         // setDuration(audio.duration);
    //         // setIsLoaded(true);
    //     };

    //     const handleTimeUpdate = () => {
    //         console.log({ time: audio.currentTime });
    //         // setCurrentTime(audio.currentTime);
    //     };

    //     const handleEnded = () => {
    //         // if (isContextMode) {
    //         //     // Let the context know this track ended
    //         //     picobelContext.playNextTrack();
    //         // } else {
    //         //     setIsPlayingLocal(false);
    //         //     audio.currentTime = 0;
    //         // }
    //         // onEnded?.();
    //     };

    //     // audioRef.current?.addEventListener("loadedmetadata", handleLoadedMetadata);
    //     // audioRef.current?.addEventListener("timeupdate", handleTimeUpdate);
    //     // audioRef.current?.addEventListener("ended", handleEnded);

    //     // // Register with the context if in context mode
    //     // if (isContextMode) {
    //     //     picobelContext.registerAudioNode(id, audio, {
    //     //         src,
    //     //         title,
    //     //         artist,
    //     //         playlistIndex
    //     //     });
    //     // }

    //     return () => {
    //         // audioRef.current?.pause();
    //         // audioRef.current?.src = "";
    //         // audioRef.current?.removeEventListener("loadedmetadata", handleLoadedMetadata);
    //         // audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    //         // audioRef.current?.removeEventListener("ended", handleEnded);

    //         // // Unregister from context if in context mode
    //         // if (isContextMode) {
    //         //     picobelContext.unregisterAudioNode(id);
    //         // }
    //     };
    // }, [
    //     src,
    //     //isContextMode,
    //     // id,
    //     // title,
    //     // artist
    //     // playlistIndex
    // ]);

    console.log({ props });
    return (
        <div>
            <h2>Picobel</h2>
            <audio
                ref={audioRef}
                src={src}
                title={title}
                data-artist={artist}
                controls={controls}
            />
            {/* <div class="bare__loader"></div>
            <button class="bare__play-pause" type="button">
                <span class="bare__play-pause__text">Play</span>
            </button>
            <div class="bare__wrapper--mute-volume">
                <button class="bare__mute" type="button">
                    Mute
                </button>
                <div class="bare__volume">
                    <label
                        class="bare__volume-label"
                        for="bare__volume-slider__range--0"
                    >
                        <span class="bare__volume-label-inner">
                            <span class="bare__volume-label-key">Volume </span>
                            <span class="bare__volume-label-value">10</span>
                        </span>
                    </label>
                    <div class="bare__volume-slider__wrapper">
                        <div class="bare__volume-slider__replacement">
                            <div class="bare__volume-slider__background"></div>
                            <div class="bare__volume-slider__indicator"></div>
                            <div class="bare__volume-slider__playhead"></div>
                        </div>
                        <input
                            class="bare__volume-slider__range"
                            id="bare__volume-slider__range--0"
                            type="range"
                            min="0"
                            max="1"
                            value="1"
                            step="0.1"
                        />
                    </div>
                </div>
            </div>
            <div class="bare__wrapper--title-artist">
                <span class="bare__title">Taken at the Flood</span>
                <span class="bare__artist">Freeze Them</span>
            </div>
            <div class="bare__wrapper--timer-progress-duration">
                <span class="bare__timer">0:00</span>
                <div class="bare__progress">
                    <label
                        class="bare__progress-label"
                        for="bare__progress-slider__range--0"
                    >
                        <span class="bare__progress-label-inner">Progress</span>
                    </label>
                    <div class="bare__progress-slider__wrapper">
                        <div class="bare__progress-slider__replacement">
                            <div class="bare__progress-slider__background"></div>
                            <div class="bare__progress-slider__indicator"></div>
                            <div class="bare__progress-slider__playhead"></div>
                        </div>
                        <input
                            class="bare__progress-slider__range"
                            id="bare__progress-slider__range--0"
                            type="range"
                            min="0"
                            max="100"
                            value="0"
                        />
                    </div>
                </div>
                <span class="bare__duration">1:42</span>
            </div> */}
        </div>
    );
};

export default Picobel;
