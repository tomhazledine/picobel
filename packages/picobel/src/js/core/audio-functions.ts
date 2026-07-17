import { setLengthDisplay, setMeta } from "../markup";
import { createElement } from "../markup/utils";
import { parseTime } from "../utils/helpers";
import { getMeta } from "./data";

export const pauseAll = nodes =>
    nodes.forEach(node => {
        pause(node);
    });

export const playPauseAudio = (node, nodes) => {
    // The media element is the source of truth for playing state —
    // second-guessing it with currentTime made pause impossible at 0:00.
    if (node.paused) {
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

export const triggerUpdateProgress = event => updateProgress(event.target);

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
    const wrapper = node.elements.wrapper;
    wrapper.classList.add("error");
    wrapper.classList.remove("loading");
    wrapper.innerHTML = "";
    const errorMessage = createElement("div", "error");
    errorMessage.appendChild(createElement("span", "error__icon"));
    const messageText = createElement("span", "error__message");
    messageText.innerHTML = "Error loading audio file";
    errorMessage.appendChild(messageText);
    wrapper.appendChild(errorMessage);
};

export const sliderScrub = (event, node) => {
    const duration = node.duration;
    const targetTime = duration * (event.target.value / 100);
    const targetTimeFixed = targetTime.toFixed(2);
    node.currentTime = targetTimeFixed;
    updateProgress(node);
};

export const sliderFocus = (node, focus) =>
    node.elements.progressWrapper.classList.toggle("focus", focus);

export const volume = (event, node) => {
    // Moving the slider is an explicit volume choice: leave mute, set
    // the new value once, and refresh the button to match.
    node.mute = false;
    setVolume(node, Number(event.target.value));
    renderMuteState(node);
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
    if (node.mute) {
        // Remember the level to come back to on unmute
        node.tmpVolume = node.volume;
        setVolume(node, 0);
    } else {
        setVolume(node, node.tmpVolume > 0 ? node.tmpVolume : 1);
    }
    renderMuteState(node);
};

// Sync the mute button's label and classes with the node's mute state
const renderMuteState = node => {
    const button = node.elements.muteButton;
    if (!button) return;
    button.classList.toggle("muted", node.mute);
    button.classList.toggle("unmuted", !node.mute);
    button.innerHTML = node.mute ? "Unmute" : "Mute";
};

export const setBuffered = (node, buffered) => {
    const duration = node.duration;
    const bufferedPercent = ((buffered / duration) * 100).toFixed(2);
    if (node.elements.progressBackground) {
        node.elements.progressBackground.style.width = bufferedPercent + "%";
    }
};

export const handleBuffering = node => {
    if (node.buffered.length > 0) {
        // Get the furthest buffered point
        const bufferedEnd = node.buffered.end(node.buffered.length - 1);

        // Update the buffer visualization
        setBuffered(node, bufferedEnd);
    }
};
