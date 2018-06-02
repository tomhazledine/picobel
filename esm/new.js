import _helpers from './helpers';

function Picobel(rawOptions = {}) {
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
    // Set options from arguments, usind defaultOptions as fallback.
    const options = Object.assign(defaultOptions, rawOptions);

    console.log(options);
    let state = {
        theme: options.theme,
        components: options.components,
        audioNodes: []
    };

    // Method to return an array of all the <audio> elements found on the page.
    const _findAudio = () => {
        // Get all the <audio> occurrences in the page.
        let audioElements = document.getElementsByTagName('audio');
        // Save our audioElements as an array (so we can manipulate the DOM but
        // still access our items).
        let items = [].slice.call(audioElements);
        return items;
    };

    // Set `components` based on theme, but can be overridden by `options.components`

    // Get audio elements from page, and save their details to `state.audioNodes`
    const audioNodes = _findAudio();
    state.audioNodes = audioNodes;

    // Build markup for each element, based on `components`

    // Replace audio elements in DOM with new markup

    // Setup event listeners

    // Provide methods for external use?

    // --- //

    return {
        state,
        findAudio: _findAudio
    };
}

export default Picobel;
