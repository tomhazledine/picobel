import { setLengthDisplay, setMeta } from "../markup";
import { parseTime } from "../utils/helpers";
import { getMeta } from "./data";

export const pauseAll = nodes =>
    nodes.forEach(node => {
        pause(node);
    });

export const playPauseAudio = (node, nodes) => {
    if (node.paused || node.currentTime === 0) {
        pauseAll(nodes);
        play(node);
    } else {
        pause(node);
    }
};

export const play = node => {
    node.play();
    const button = node.elements.playPauseButton;
    const buttonText = node.elements.playPauseButtonText;
    button.classList.remove("paused");
    buttonText.innerHTML = "Pause";
    button.classList.add("playing");
};

export const pause = node => {
    node.pause();
    const button = node.elements.playPauseButton;
    const buttonText = node.elements.playPauseButtonText;
    button.classList.remove("playing");
    buttonText.innerHTML = "Play";
    button.classList.add("paused");
};

export const stop = node => {
    node.pause();
    const button = node.elements.playPauseButton;
    const buttonText = node.elements.playPauseButtonText;
    button.classList.remove("playing");
    buttonText.innerHTML = "Play";
};

export const triggerUpdateProgress = event => updateProgress(event.srcElement);

export const updateProgress = node => {
    const progress = node.currentTime;
    const duration = node.duration;
    if (node.elements.playTimer) {
        const progressParsed = parseTime(progress);
        node.elements.playTimer.innerHTML = progressParsed;
    }
    if (progress >= duration) {
        stop(node);
    }
    const progressPercent = ((progress / duration) * 100).toFixed(2);
    if (node.elements.progressRange) {
        node.elements.progressRange.value = progressPercent;
        node.elements.progressIndicator.style.width = progressPercent + "%";
        node.elements.progressPlayhead.style.left = progressPercent + "%";
    }
};

export const canplaythrough = node => {
    setLengthDisplay(node);
    // setBuffered(node, node.duration);
    loadedmetadata(node);
};

export const loadedmetadata = node => {
    node.elements.wrapper.classList.remove("loading");
    const meta = getMeta(node);
    setMeta(meta, node.elements);
};

export const errors = node => {
    node.elements.wrapper.classList.add("error");
    node.elements.wrapper.classList.remove("loading");
    node.elements.wrapper.innerHTML = `<div class="error" style="display:flex;height: 100%;align-items:  center;justify-content: center;"><span class="error__icon"></span><span class="error__message">Error loading audio file</span></div>`;
};

export const sliderScrub = (event, node) => {
    const duration = node.duration;
    const targetTime = duration * (event.srcElement.value / 100);
    const targetTimeFixed = targetTime.toFixed(2);
    node.currentTime = targetTimeFixed;
    updateProgress(node);
};

export const sliderFocus = (node, focus) =>
    node.elements.progressWrapper.classList.toggle("focus", focus);

export const volume = (event, node) => {
    const volume = event.srcElement.value;
    node.tmpVolume = node.volume;
    node.mute = false;
    mute(node);
    setVolume(node, volume);
};

export const volumeFocus = (node, focus) =>
    node.elements.volumeWrapper.classList.toggle("focus", focus);

export const setVolume = (node, value) => {
    const valueMapped = value * 10;
    const volumePercent = (value * 100).toFixed(2);
    node.volume = value;
    if (node.elements.volumeDisplay) {
        node.elements.volumeDisplay.innerHTML = valueMapped;
    }
    if (node.elements.volumeControl) {
        node.elements.volumeControl.value = value;
    }
    if (node.elements.volumeIndicator) {
        node.elements.volumeIndicator.style.width = volumePercent + "%";
    }
    if (node.elements.volumePlayhead) {
        node.elements.volumePlayhead.style.left = volumePercent + "%";
    }
};

export const muteUnmuteAudio = node => {
    node.mute = !node.mute;
    mute(node);
};

export const mute = node => {
    const button = node.elements.muteButton;

    if (node.mute) {
        node.tmpVolume = node.volume;
        setVolume(node, 0);
        button.classList.add("muted");
        button.classList.remove("unmuted");
        button.innerHTML = "Unmute";
    } else {
        if (typeof node.tmpVolume != "undefined" && node.tmpVolume > 0) {
            setVolume(node, node.tmpVolume);
        } else {
            setVolume(node, 1);
        }
        button.classList.remove("muted");
        button.classList.add("unmuted");
        button.innerHTML = "Mute";
    }
};

export const setBuffered = (node, buffered) => {
    const duration = node.duration;
    const bufferedPercent = ((buffered / duration) * 100).toFixed(2);
    if (node.elements.progressBackground) {
        node.elements.progressBackground.style.width = bufferedPercent + "%";
    }
};
