import _helpers from "./helpers";
import PicobelSetup from "./PicobelSetup";
import PicobelData from "./PicobelData";
import PicobelMarkup from "./PicobelMarkup";

/**
 * -----------------------------------------------------------------------------
 *  ____  _           _          _    _
 * |  _ \(_) ___ ___ | |__   ___| |  (_)___
 * | |_) | |/ __/ _ \| '_ \ / _ \ |  | / __|
 * |  __/| | (_| (_) | |_) |  __/ |_ | \__ \
 * |_|   |_|\___\___/|_.__/ \___|_(_)| |___/
 * Picobel.js                       _/ |
 * tomhazledine.com/audio          |__/
 *
 * =============================================================================
 *
 * Replace any native <audio> instances with standard elements (spans, buttons &
 * divs) that we can style however we like.
 *
 * Functionality powered by Web Audio API.
 * -----------------------------------------------------------------------------
 */

function Picobel(rawOptions = {}) {
    /**
     * -------------------------------------------------------------------------
     * RUN THE CODE
     *
     * This is where the methods are called. Reading these lines should give you
     * a step-by-step overview of what Picobel does.
     * -------------------------------------------------------------------------
     */

    // Parse the options
    const options = PicobelSetup.parseOptions(rawOptions);

    // Declare a `state` variable that will hold the active state
    let state = PicobelSetup.setState({}, { audioNodes: [] });

    // Add options to state
    state = PicobelSetup.setState(state, {
        theme: options.theme,
        components: options.components
    });

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
            node.elements.playPauseButton[0].addEventListener(
                "click",
                PicobelAudio.triggerPlayPauseAudio,
                false
            );
            node.elements.progressBar[0].addEventListener(
                "input",
                PicobelAudio.sliderScrub,
                false
            );
            node.elements.progressBar[0].addEventListener(
                "focus",
                e => PicobelAudio.sliderFocus(e, true),
                false
            );
            node.elements.progressBar[0].addEventListener(
                "blur",
                e => PicobelAudio.sliderFocus(e, false),
                false
            );
            node.elements.volumeControl[0].addEventListener(
                "input",
                PicobelAudio.volume,
                false
            );
            node.elements.volumeControl[0].addEventListener(
                "focus",
                e => PicobelAudio.volumeFocus(e, true),
                false
            );
            node.elements.volumeControl[0].addEventListener(
                "blur",
                e => PicobelAudio.volumeFocus(e, false),
                false
            );
            node.elements.muteButton[0].addEventListener(
                "click",
                PicobelAudio.muteUnmuteAudio,
                false
            );
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
            let button = node.elements.playPauseButton[0];
            button.classList.remove("songPaused");
            button.classList.add("songPlaying");
        },
        pause: node => {
            node.pause();
            let button = node.elements.playPauseButton[0];
            button.classList.remove("songPlaying");
            button.classList.add("songPaused");
        },
        triggerUpdateProgress: event =>
            PicobelAudio.updateProgress(event.srcElement),

        updateProgress: node => {
            let progress = node.currentTime;
            let duration = node.duration;
            let progressParsed = _helpers.parseTime(progress);
            node.elements.playTimer[0].innerHTML = progressParsed;
            if (progress >= duration) {
                node.elements.playPauseButton[0].classList.remove(
                    "songPlaying"
                );
            }
            let progressPercent = ((progress / duration) * 100).toFixed(2);
            node.elements.progressBar[0].value = progressPercent;
            node.elements.indicator[0].style.width = progressPercent + "%";
            node.elements.playhead[0].style.left = progressPercent + "%";
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
            node.elements.progressWrapper[0].classList.toggle("focus", focus);
        },
        volume: event => {
            let index = _helpers.findParentIndex(event.srcElement);
            let node = state.audioNodes.find(node => node.key == index);
            let volume = event.srcElement.value;
            PicobelAudio.mute(node, false);
            PicobelAudio.setVolume(node, volume);
        },
        volumeFocus: (event, focus) => {
            let index = _helpers.findParentIndex(event.srcElement);
            let node = state.audioNodes.find(node => node.key == index);
            node.elements.volumeWrapper[0].classList.toggle("focus", focus);
        },
        setVolume: (node, value) => {
            let valueMapped = value * 10;
            let volumePercent = value * 100;
            node.volume = value;
            node.elements.volumeDisplay[0].innerHTML = valueMapped;
            node.elements.volumeControl[0].value = value;
            node.elements.volumeIndicator[0].style.width = volumePercent + "%";
            node.elements.volumePlayhead[0].style.left = volumePercent + "%";
        },
        muteUnmuteAudio: event => {
            let index = _helpers.findParentIndex(event.srcElement);
            let node = state.audioNodes.find(node => node.key == index);
            node.mute = !node.mute;
            PicobelAudio.mute(node, node.mute);
        },
        mute: (node, mute) => {
            // node.mute = !mute;
            let button = node.elements.muteButton[0];
            if (node.mute) {
                node.tmpVolume = node.volume;
                PicobelAudio.setVolume(node, 0);
                button.classList.add("songMuted");
                button.classList.remove("songUnmuted");
                button.innerHTML = "unmute";
            } else {
                if (
                    typeof node.tmpVolume != "undefined" &&
                    node.tmpVolume > 0
                ) {
                    PicobelAudio.setVolume(node, node.tmpVolume);
                } else {
                    PicobelAudio.setVolume(node, 1);
                }
                button.classList.remove("songMuted");
                button.classList.add("songUnmuted");
                button.innerHTML = "mute";
            }
        }
    };

    // Set `components` based on theme (but overridden by explicit `options`).
    state.components = PicobelSetup.setComponentsByTheme(
        state.theme,
        rawOptions.components
    );

    // Get audio elements from page, and save their details to state.
    state.audioNodes = PicobelData.findAudio(options.context);

    state.audioNodes = PicobelData.getRawData(state.audioNodes);

    // Build markup for each element, based on `components`
    const markup = PicobelMarkup.generateMarkup(
        state.audioNodes,
        state.components
    );

    // Replace audio elements in DOM with new markup
    _replaceNodes(state.audioNodes, markup);

    // Save new DOM elements to our node list
    state.audioNodes = PicobelMarkup.elementHooks(
        state.audioNodes,
        options.context
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
}

export default Picobel;
