import { setLengthDisplay, setMeta } from "./markup";
import { getMeta } from "./data";
import { parseTime } from "./utils/helpers";

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
    let progress = node.currentTime;
    let duration = node.duration;
    if (node.elements.playTimer) {
        let progressParsed = parseTime(progress);
        node.elements.playTimer.innerHTML = progressParsed;
    }
    if (progress >= duration) {
        stop(node);
    }
    let progressPercent = ((progress / duration) * 100).toFixed(2);
    if (node.elements.progressBar) {
        node.elements.progressBar.value = progressPercent;
        node.elements.indicator.style.width = progressPercent + "%";
        node.elements.playhead.style.left = progressPercent + "%";
    }
};

export const canplaythrough = node => {
    setLengthDisplay(node);
    node.elements.wrapper.classList.remove("loading");
    let meta = getMeta(node);
    setMeta(meta, node.elements);
};

export const errors = node => {
    node.elements.wrapper.classList.add("error");
    node.elements.wrapper.classList.remove("loading");
    node.elements.wrapper.innerHTML = `<div class="error" style="display:flex;height: 100%;align-items:  center;justify-content: center;"><span class="error__icon"></span><span class="error__message">Error loading audio file</span></div>`;
};

export const sliderScrub = (event, node) => {
    let duration = node.duration;
    let targetTime = duration * (event.srcElement.value / 100);
    targetTime = targetTime.toFixed(2);
    node.currentTime = targetTime;
    updateProgress(node);
};

export const sliderFocus = (node, focus) =>
    node.elements.progressWrapper.classList.toggle("focus", focus);

export const volume = (event, node) => {
    let volume = event.srcElement.value;
    node.tmpVolume = node.volume;
    node.mute = false;
    mute(node);
    setVolume(node, volume);
};

export const volumeFocus = (node, focus) =>
    node.elements.volumeWrapper.classList.toggle("focus", focus);

export const setVolume = (node, value) => {
    let valueMapped = value * 10;
    let volumePercent = value * 100;
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
