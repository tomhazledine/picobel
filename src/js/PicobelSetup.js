/**
 * -----------------------------------------------------------------------------
 * SETUP
 *
 * Parse our options, and set starting state.
 * -----------------------------------------------------------------------------
 */

// Return a `components` object that matches the provided themename.
const setComponentsByTheme = (themename = "default") => {
    switch (themename) {
        case "default":
        default:
            return [
                "playPause",
                ["mute", "volume"],
                ["title", "artist"],
                ["timer", "progress", "duration"]
            ];
    }
};

export const parseOptions = (rawOptions = {}) => {
    // Define our default options.
    const defaultOptions = {
        context: document,
        theme: "default",
        preload: false
    };
    const components = setComponentsByTheme(rawOptions.theme);
    const options = { ...defaultOptions, components, ...rawOptions };

    return options;
};
