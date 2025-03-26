/**
 * -----------------------------------------------------------------------------
 * SETUP
 *
 * Parse our options, and set starting state.
 * -----------------------------------------------------------------------------
 */

type Component = string;
export type ComponentGroup = Component | ComponentGroup[];

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

export type Options = {
    context?: Document | HTMLElement;
    theme?: string;
    preload?: boolean;
    components?: ComponentGroup[];
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
