import _helpers from './helpers';

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
     * SETUP
     *
     * Parse our options, and set starting state.
     * -------------------------------------------------------------------------
     */

    // Define our default options.
    const defaultOptions = {
        theme: 'default',
        components: {
            playPause: true,
            progress: true,
            volume: true,
            download: false,
            mute: true,
            duration: true,
            timer: true
        }
    };
    // Set `options` from arguments, usind `defaultOptions` as fallback.
    const options = Object.assign(defaultOptions, rawOptions);

    // Declare a `state` variable that will hold the active state.
    let state = {
        theme: options.theme,
        components: options.components,
        audioNodes: []
    };

    /**
     * -------------------------------------------------------------------------
     * MAIN METHODS
     *
     * The functions we will use to generate Picobel's core functionality.
     * -------------------------------------------------------------------------
     */

    // Return a `components` object that matches the provided themename.
    const _setComponentsByTheme = (themename = 'default', rawComponents = {}) => {
        const defaultComponents = {
            playPause: true,
            progress: true,
            volume: true,
            download: false,
            mute: true,
            duration: true,
            timer: true
        };
        const activeComponents = Object.assign(defaultComponents, rawComponents);
        return activeComponents;
    };

    // Return an array of all the <audio> elements found on the page.
    const _findAudio = () => {
        // Get all the <audio> occurrences in the page.
        let audioElements = document.getElementsByTagName('audio');
        // Save our audioElements as an array (so we can manipulate the DOM but
        // still access our items).
        let items = [].slice.call(audioElements);
        return items;
    };

    const _generateMarkup = (nodes, components) => {
        nodes.map((node, key) => {});
    };

    /**
     * -------------------------------------------------------------------------
     * RUN THE CODE
     *
     * This is where the methods are called. Reading these lines should give you
     * a step-by-step overview of what Picobel does.
     * -------------------------------------------------------------------------
     */

    // Set `components` based on theme (but overridden by explicit `options`).
    state.components = _setComponentsByTheme(state.theme, rawOptions.components);

    // Get audio elements from page, and save their details to state.
    const audioNodes = _findAudio();
    state.audioNodes = audioNodes;

    // Build markup for each element, based on `components`
    const markup = _generateMarkup(state.audioNodes, state.components);

    // Replace audio elements in DOM with new markup

    // Setup event listeners

    // Provide methods for external use?

    // --- //

    /**
     * -------------------------------------------------------------------------
     * API
     *
     * Make these methods public - useful for testing.
     * -------------------------------------------------------------------------
     */

    return {
        state,
        setComponentsByTheme: _setComponentsByTheme,
        findAudio: _findAudio
    };
}

export default Picobel;
