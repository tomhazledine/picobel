import _helpers from "./helpers";
import { parseOptions } from "./PicobelSetup";
import PicobelData from "./PicobelData";
import PicobelMarkup from "./PicobelMarkup";

/**
 * ---------------------------------------------------------------------------
 *  ____  _           _          _    _
 * |  _ \(_) ___ ___ | |__   ___| |  (_)___
 * | |_) | |/ __/ _ \| '_ \ / _ \ |  | / __|
 * |  __/| | (_| (_) | |_) |  __/ |_ | \__ \
 * |_|   |_|\___\___/|_.__/ \___|_(_)| |___/
 * Picobel.js                       _/ |
 * tomhazledine.com/audio          |__/
 *
 * ===========================================================================
 *
 * Replace any native <audio> instances with standard elements (spans,
 * buttons & divs) that we can style however we like.
 *
 * Functionality powered by Web Audio API.
 * ---------------------------------------------------------------------------
 */

export const picobel = (rawOptions = {}) => {
    /**
     * -----------------------------------------------------------------------
     * RUN THE CODE
     *
     * This is where the methods are called. Reading these lines should
     * give you a step-by-step overview of what Picobel does.
     * -----------------------------------------------------------------------
     */

    // Parse the options
    const options = parseOptions(rawOptions);

    // Declare a `state` variable that will hold the active state
    let state = {
        audioNodes: [],
        theme: options.theme,
        components: options.components
    };

    const _replaceNodes = (audioElements, newMarkup) => {
        audioElements.map((element, key) => {
            element.parentNode.replaceChild(newMarkup[key], element);
        });
    };

    const _setupLocalListeners = nodes =>
        nodes.map((node, key) => {
            // Audio event listeners
            node.addEventListener(
                "timeupdate",
                PicobelAudio.triggerUpdateProgress,
                false
            );
            node.addEventListener(
                "canplaythrough",
                PicobelAudio.canplaythrough,
                false
            );
            node.addEventListener(
                "error",
                () => PicobelAudio.errors(key),
                false
            );

            // DOM interaction event listeners
            if (node.elements.playPauseButton) {
                node.elements.playPauseButton.addEventListener(
                    "click",
                    PicobelAudio.triggerPlayPauseAudio,
                    false
                );
            }
            if (node.elements.progressBar) {
                node.elements.progressBar.addEventListener(
                    "input",
                    PicobelAudio.sliderScrub,
                    false
                );
            }
            if (node.elements.progressBar) {
                node.elements.progressBar.addEventListener(
                    "focus",
                    e => PicobelAudio.sliderFocus(e, true),
                    false
                );
            }
            if (node.elements.progressBar) {
                node.elements.progressBar.addEventListener(
                    "blur",
                    e => PicobelAudio.sliderFocus(e, false),
                    false
                );
            }
            if (node.elements.volumeControl) {
                node.elements.volumeControl.addEventListener(
                    "input",
                    PicobelAudio.volume,
                    false
                );
            }
            if (node.elements.volumeControl) {
                node.elements.volumeControl.addEventListener(
                    "focus",
                    e => PicobelAudio.volumeFocus(e, true),
                    false
                );
            }
            if (node.elements.volumeControl) {
                node.elements.volumeControl.addEventListener(
                    "blur",
                    e => PicobelAudio.volumeFocus(e, false),
                    false
                );
            }
            if (node.elements.muteButton) {
                node.elements.muteButton.addEventListener(
                    "click",
                    PicobelAudio.muteUnmuteAudio,
                    false
                );
            }
            return node;
        });

    const PicobelAudio = {
        pauseAll: () => {
            state.audioNodes.forEach(node => {
                PicobelAudio.pause(node);
            });
        },
        triggerPlayPauseAudio: event => {
            let index = _helpers.findParentIndex(event.srcElement);
            let node = state.audioNodes.find(node => node.key == index);
            PicobelAudio.playPauseAudio(node);
        },
        playPauseAudio: node => {
            if (node.paused || node.currentTime === 0) {
                PicobelAudio.pauseAll();
                PicobelAudio.play(node);
            } else {
                PicobelAudio.pause(node);
            }
        },
        play: node => {
            node.play();
            const button = node.elements.playPauseButton;
            const buttonText = node.elements.playPauseButtonText;
            button.classList.remove("paused");
            buttonText.innerHTML = "Pause";
            button.classList.add("playing");
        },
        pause: node => {
            node.pause();
            const button = node.elements.playPauseButton;
            const buttonText = node.elements.playPauseButtonText;
            button.classList.remove("playing");
            buttonText.innerHTML = "Play";
            button.classList.add("paused");
        },
        stop: node => {
            node.pause();
            const button = node.elements.playPauseButton;
            const buttonText = node.elements.playPauseButtonText;
            button.classList.remove("playing");
            buttonText.innerHTML = "Play";
        },
        triggerUpdateProgress: event =>
            PicobelAudio.updateProgress(event.srcElement),

        updateProgress: node => {
            let progress = node.currentTime;
            let duration = node.duration;
            if (node.elements.playTimer) {
                let progressParsed = _helpers.parseTime(progress);
                node.elements.playTimer.innerHTML = progressParsed;
            }
            if (progress >= duration) {
                PicobelAudio.stop(node);
            }
            let progressPercent = ((progress / duration) * 100).toFixed(2);
            if (node.elements.progressBar) {
                node.elements.progressBar.value = progressPercent;
                node.elements.indicator.style.width = progressPercent + "%";
                node.elements.playhead.style.left = progressPercent + "%";
            }
        },
        canplaythrough: function () {
            PicobelMarkup.setLengthDisplay(this);
            this.elements.wrapper.classList.remove("loading");
            let meta = PicobelData.getMeta(this);
            PicobelMarkup.setMeta(meta, this.elements);
        },
        errors: i => {
            const { elements } = state.audioNodes[i];
            elements.wrapper.classList.add("error");
            elements.wrapper.classList.remove("loading");
            elements.wrapper.innerHTML = `<div class="error" style="display:flex;height: 100%;align-items:  center;justify-content: center;"><span class="error__icon"></span><span class="error__message">Error loading audio file</span></div>`;
        },
        sliderScrub: event => {
            let index = _helpers.findParentIndex(event.srcElement);
            let activeNode = state.audioNodes.find(node => node.key == index);
            let duration = activeNode.duration;
            let targetTime = duration * (event.srcElement.value / 100);
            targetTime = targetTime.toFixed(2);
            activeNode.currentTime = targetTime;
            PicobelAudio.updateProgress(activeNode);
        },
        sliderFocus: (event, focus) => {
            let index = _helpers.findParentIndex(event.srcElement);
            let node = state.audioNodes.find(node => node.key == index);
            node.elements.progressWrapper.classList.toggle("focus", focus);
        },
        volume: event => {
            let index = _helpers.findParentIndex(event.srcElement);
            let node = state.audioNodes.find(node => node.key == index);
            let volume = event.srcElement.value;
            node.tmpVolume = node.volume;
            node.mute = false;
            PicobelAudio.mute(node);
            PicobelAudio.setVolume(node, volume);
        },
        volumeFocus: (event, focus) => {
            let index = _helpers.findParentIndex(event.srcElement);
            let node = state.audioNodes.find(node => node.key == index);
            node.elements.volumeWrapper.classList.toggle("focus", focus);
        },
        setVolume: (node, value) => {
            let valueMapped = value * 10;
            let volumePercent = value * 100;
            node.volume = value;
            console.log;
            node.elements.volumeDisplay.innerHTML = valueMapped;
            node.elements.volumeControl.value = value;
            node.elements.volumeIndicator.style.width = volumePercent + "%";
            node.elements.volumePlayhead.style.left = volumePercent + "%";
        },
        muteUnmuteAudio: event => {
            let index = _helpers.findParentIndex(event.srcElement);
            let node = state.audioNodes.find(node => node.key == index);
            node.mute = !node.mute;
            PicobelAudio.mute(node);
        },
        mute: node => {
            const button = node.elements.muteButton;

            if (node.mute) {
                node.tmpVolume = node.volume;
                PicobelAudio.setVolume(node, 0);
                button.classList.add("muted");
                button.classList.remove("unmuted");
                button.innerHTML = "Unmute";
            } else {
                if (
                    typeof node.tmpVolume != "undefined" &&
                    node.tmpVolume > 0
                ) {
                    PicobelAudio.setVolume(node, node.tmpVolume);
                } else {
                    PicobelAudio.setVolume(node, 1);
                }
                button.classList.remove("muted");
                button.classList.add("unmuted");
                button.innerHTML = "Mute";
            }
        }
    };

    // Get audio elements from page, and save their details to state.
    state.audioNodes = PicobelData.findAudio(options.context);

    state.audioNodes = PicobelData.getRawData(state.audioNodes);

    // Build markup for each element, based on `components`
    const markup = PicobelMarkup.generateMarkup(
        state.audioNodes,
        state.components,
        state.theme
    );

    // Replace audio elements in DOM with new markup
    _replaceNodes(state.audioNodes, markup);

    // Save new DOM elements to our node list
    state.audioNodes = PicobelMarkup.elementHooks(
        state.audioNodes,
        options.context,
        state.theme
    );

    // Setup event listeners
    state.audioNodes = _setupLocalListeners(state.audioNodes);

    // Check status
    state.audioNodes.forEach(node => {
        const { readyState } = node;
        if (readyState === 4) {
            PicobelAudio.canplaythrough.call(node);
        }
    });

    return {
        state,
        PicobelAudio
    };
};
