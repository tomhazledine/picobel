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

/**
 * -----------------------------------------------------------------------------
 * SETUP
 *
 * Parse our options, and set starting state.
 * -----------------------------------------------------------------------------
 */
export const PicobelSetup = {
    // Parse the options on init.
    parseOptions: (rawOptions = {}) => {
        // Define our default options.
        const defaultOptions = {
            theme: 'default',
            preload: false,
            components: {
                theme: 'default',
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
    setComponentsByTheme: (themename = 'default', rawComponents = {}) => {
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
        const activeComponents = Object.assign(defaultComponents, rawComponents);
        return activeComponents;
    }
};

export const PicobelData = {
    // Return an array of all the <audio> elements found on the page.
    findAudio: () => {
        // Get all the <audio> occurrences in the page.
        let audioElements = document.getElementsByTagName('audio');
        // Save our audioElements as an array (so we can manipulate the DOM but
        // still access our items).
        let items = [].slice.call(audioElements);
        return items;
    },

    // Build an array of classes to add to each new "player" element
    prepareClasses: (index, classes, theme) => {
        const classesString = `customAudioPlayer loading player_${index} ${classes}`;
        const classesArray = classesString.trim().split(' ');
        classesArray.push(theme);
        return classesArray;
    },

    // Get the url for each audio file we want to load [using elements found by findAudio()]
    getRawData: nodes =>
        nodes.map((node, key) => ({
            key: key,
            preload: node.preload,
            url: node.src,
            className: node.className
        }))
};

export const PicobelMarkup = {
    // Create markup for a custom slider
    buildSlider: (namespace = 'picobel', min = 0, max = 100, value = 0, step = false) => {
        // Create a container element to hold all the parts
        let wrapper = document.createElement('div');
        wrapper.className = `${namespace}-slider__wrapper`;

        // Create a background div
        let background = document.createElement('div');
        background.className = `${namespace}-slider__background`;
        // Add the background to the container
        wrapper.appendChild(background);

        // Create a progress indicator
        let progressIndicator = document.createElement('div');
        progressIndicator.className = `${namespace}-slider__progress-indicator`;
        wrapper.appendChild(progressIndicator);

        // Create a "playhead"
        let playhead = document.createElement('div');
        playhead.className = `${namespace}-slider__playhead`;
        wrapper.appendChild(playhead);

        // Create an (invisible) input (html range)
        let progress = document.createElement('input');
        progress.type = 'range';
        progress.min = min;
        progress.max = max;
        progress.value = value;
        if (step) {
            progress.step = step;
        }
        progress.className = `${namespace}-slider__range`;
        wrapper.appendChild(progress);

        return wrapper;
    },

    generateMarkup: (nodes = [], components) => {
        const markupArray = nodes.map(node => {
            // Create a container for our new player
            const newPlayer = document.createElement('div');

            // Set the relevant classes on the new player element
            const classes = PicobelData.prepareClasses(node.key, node.className, components.theme);
            newPlayer.classList.add(...classes);

            // Set song index attribute
            newPlayer.setAttribute('data-song-index', node.key);

            // Create a loading indicator
            let loading = document.createElement('div');
            loading.className = 'loader';
            newPlayer.appendChild(loading);

            // TODO: Add "waiting" indicator here?

            // -----------------
            // PLAY/PAUSE BUTTON
            // -----------------
            if (components.playPause) {
                // Create a play/pause button
                let button = document.createElement('button');
                button.className = 'playerTrigger';
                let buttonText = document.createElement('span');
                buttonText.className = 'buttonText';
                buttonText.innerHTML = 'play';
                button.appendChild(buttonText);
                // Add the button to the player
                newPlayer.appendChild(button);
            }

            // ---------
            // META DATA
            // ---------
            // Create a wrapper for our player's metadata
            let meta = document.createElement('div');
            meta.className = 'metaWrapper';

            // Create elements to display file metadata
            let meta_title = document.createElement('span');
            meta_title.className = 'titleDisplay';
            meta_title.innerHTML = 'File ' + (node.key + 1);
            meta.appendChild(meta_title);

            let meta_artist = document.createElement('span');
            meta_artist.className = 'artistDisplay';
            meta.appendChild(meta_artist);

            // Add the metadata to the player
            newPlayer.appendChild(meta);

            // -----------------------------------
            // TIMINGS (PROGRESS, DURATION, TIMER)
            // -----------------------------------
            if (components.progress || components.duration || components.timer) {
                let timings = document.createElement('div');
                timings.className = 'timingsWrapper';

                if (components.timer) {
                    let timer = document.createElement('span');
                    timer.className = 'songPlayTimer';
                    timer.innerHTML = '0:00';
                    timings.appendChild(timer);
                }

                if (components.progress) {
                    let progress = PicobelMarkup.buildSlider('progress', 0, 100, 0);
                    timings.appendChild(progress);
                }

                if (components.duration) {
                    let duration = document.createElement('span');
                    duration.className = 'songDuration';
                    duration.innerHTML = '-:--';
                    timings.appendChild(duration);
                }

                // Add the timings to the player
                newPlayer.appendChild(timings);
            }

            // ----------------
            // VOLUME INDICATOR
            // ----------------
            if (components.volume || components.mute) {
                // Volume Indicator
                let volume = document.createElement('div');
                volume.className = 'songVolume';

                if (components.mute) {
                    let mute = document.createElement('button');
                    mute.className = 'songMuteButton';
                    mute.innerHTML = 'Mute';
                    volume.appendChild(mute);
                }

                if (components.volume) {
                    let volume_label_wrapper = document.createElement('div');
                    volume_label_wrapper.className = 'songVolumeLabelWrapper';
                    let volume_label = document.createElement('span');
                    volume_label.className = 'songVolumeLabel';
                    volume_label.innerHTML = 'Volume';
                    volume_label_wrapper.appendChild(volume_label);
                    let volume_value = document.createElement('span');
                    volume_value.className = 'songVolumeValue';
                    volume_value.innerHTML = '10';
                    volume_label_wrapper.appendChild(volume_value);
                    volume.appendChild(volume_label_wrapper);

                    let volume_slider = PicobelMarkup.buildSlider('volume', 0, 1, 1, 0.1);
                    volume.appendChild(volume_slider);
                }
                newPlayer.appendChild(volume);
            }

            return newPlayer;
        });

        return markupArray;
    }
};

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
    let state = PicobelSetup.setState({}, { rawNodes: [], audioNodes: [] });

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

    // Set `components` based on theme (but overridden by explicit `options`).
    state.components = PicobelSetup.setComponentsByTheme(state.theme, rawOptions.components);

    // Get audio elements from page, and save their details to state.
    state.rawNodes = PicobelData.findAudio();

    state.audioNodes = PicobelData.getRawData(state.rawNodes);

    // Build markup for each element, based on `components`
    const markup = PicobelMarkup.generateMarkup(state.audioNodes, state.components);

    // Replace audio elements in DOM with new markup
    _replaceNodes(state.rawNodes, markup);

    // Setup event listeners

    // Provide methods for external use?

    return {
        state
    };
}

export default Picobel;
