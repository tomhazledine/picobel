import { Options, ComponentGroup } from "../types";

/**
 * -----------------------------------------------------------------------------
 * SETUP
 *
 * Parse our options, and set starting state.
 * -----------------------------------------------------------------------------
 */

// Return a `components` object that matches the provided themename.
const setComponentsByTheme = (themename: string = "default"): ComponentGroup[] => {
    switch (themename) {
        case "itunes":
            return [
                "playPause",
                [
                    ["title", "artist"],
                    ["timer", "progress", "duration"]
                ]
            ];
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
export const parseOptions = (rawOptions: Options = {}) => {
    // Define our default options.
    const defaultOptions = {
        context: document,
        theme: "default",
        preload: false
    };
    const { components: userComponents, ...otherOptions } = rawOptions;
    const components = setComponentsByTheme(rawOptions.theme);
    const options = { ...defaultOptions, components, ...otherOptions };
    if (userComponents && Array.isArray(userComponents)) {
        options.components = userComponents;
    }

    return options;
};
