/**
 * -----------------------------------------------------------------------------
 * SETUP
 *
 * Parse our options, and set starting state.
 * -----------------------------------------------------------------------------
 */
const PicobelSetup = {
    // Parse the options on init.
    parseOptions: (rawOptions = {}) => {
        // Define our default options.
        const defaultOptions = {
            context: document,
            theme: "default",
            preload: false,
            components: {
                theme: "default",
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

        return options;
    },

    // Update the state.
    setState: (oldState, changes) => Object.assign(oldState, changes),

    // Return a `components` object that matches the provided themename.
    setComponentsByTheme: (themename = "default", rawComponents = {}) => {
        const defaultComponents = {
            theme: themename,
            playPause: true,
            progress: true,
            volume: true,
            download: false,
            mute: true,
            duration: true,
            timer: true
        };
        const activeComponents = Object.assign(
            defaultComponents,
            rawComponents
        );
        return activeComponents;
    }
};

export default PicobelSetup;
