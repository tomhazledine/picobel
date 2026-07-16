import { loadedmetadata } from "./core/audio-functions";
import { type AudioElement, findAudio, getRawData } from "./core/data";
import { _setupLocalListeners, removeLocalListeners } from "./core/events";
import { parseOptions } from "./core/setup";
import { elementHooks,generateMarkup } from "./markup";
import { type ComponentGroup, type Options } from "./types";

/**
 * ---------------------------------------------------------------------------
 *  ____  _           _          _    _
 * |  _ \(_) ___ ___ | |__   ___| |  (_)___
 * | |_) | |/ __/ _ \| '_ \ / _ \ |  | / __|
 * |  __/| | (_| (_) | |_) |  __/ |_ | \__ \
 * |_|   |_|\___\___/|_.__/ \___|_(_)| |___/
 * Picobel.js                       _/ |
 * picobel.tomhazledine.com        |__/
 *
 * ===========================================================================
 *
 * Replace any native <audio> instances with standard elements (spans,
 * buttons & divs) that you can style however you like.
 * ---------------------------------------------------------------------------
 */
export const picobel = (rawOptions: Options = {}) => {
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
    const state = {
        audioNodes: [] as AudioElement[],
        theme: options.theme,
        components: options.components as ComponentGroup[]
    };

    const _replaceNodes = (audioElements, newMarkup) => {
        audioElements.map((element, key) => {
            element.parentNode.replaceChild(newMarkup[key], element);
        });
    };

    // Get audio elements from page, and save their details to state.
    state.audioNodes = findAudio(options.context);

    state.audioNodes = getRawData(state.audioNodes as AudioElement[]);

    // Build markup for each element, based on `components`
    const markup = generateMarkup(
        state.audioNodes as AudioElement[],
        state.components,
        state.theme
    );

    // Replace audio elements in DOM with new markup
    _replaceNodes(state.audioNodes, markup);

    // Save new DOM elements to our node list
    state.audioNodes = elementHooks(state.audioNodes, markup, state.theme);

    // Setup event listeners
    state.audioNodes = _setupLocalListeners(state.audioNodes);

    // Check status
    state.audioNodes.forEach(node => {
        if (node.readyState >= 1) {
            loadedmetadata(node);
        }
    });

    // Undo everything: stop playback, detach all listeners, and swap the
    // player markup back out for the original <audio> elements. Without
    // this, removing a player's DOM leaves a detached-but-playing audio
    // element with no remaining handle to stop it.
    const destroy = () => {
        state.audioNodes.forEach(node => {
            node.pause();
            removeLocalListeners(node);
            const wrapper = node.elements?.wrapper;
            if (wrapper?.parentNode) {
                wrapper.parentNode.replaceChild(node, wrapper);
            }
            delete node.elements;
        });
        state.audioNodes = [];
    };

    return { state, destroy };
};
