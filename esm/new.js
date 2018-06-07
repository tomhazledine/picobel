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
        nodes.map((node, key) => {
            node.key = key;
            return node;
        })
};

export const PicobelMarkup = {
    // Create markup for a custom slider
    buildSlider: (namespace = 'picobel', min = 0, max = 100, value = 0, step = false) => {
        // Create a container element to hold all the parts
        let wrapper = PicobelMarkup.createElement('div', `${namespace}-slider__wrapper`);

        // Create a background div
        let background = PicobelMarkup.createElement('div', `${namespace}-slider__background`);
        // Add the background to the container
        wrapper.appendChild(background);

        // Create a progress indicator
        let progressIndicator = PicobelMarkup.createElement(
            'div',
            `${namespace}-slider__progress-indicator`
        );
        wrapper.appendChild(progressIndicator);

        // Create a "playhead"
        let playhead = PicobelMarkup.createElement('div', `${namespace}-slider__playhead`);
        wrapper.appendChild(playhead);

        // Create an (invisible) input (html range)
        let progress = PicobelMarkup.createElement('input', `${namespace}-slider__range`);
        progress.type = 'range';
        progress.min = min;
        progress.max = max;
        progress.value = value;
        if (step) {
            progress.step = step;
        }
        wrapper.appendChild(progress);

        return wrapper;
    },

    createElement: (type = 'div', className = '') => {
        const newElement = document.createElement(type);
        newElement.className = className;
        return newElement;
    },

    generateMarkup: (nodes = [], components) => {
        const markupArray = nodes.map(node => {
            // Create a container for our new player
            const newPlayer = PicobelMarkup.createElement('div');

            // Set the relevant classes on the new player element
            const classes = PicobelData.prepareClasses(node.key, node.className, components.theme);
            newPlayer.classList.add(...classes);

            // Set song index attribute
            newPlayer.setAttribute('data-song-index', node.key);

            // Create a loading indicator
            let loading = PicobelMarkup.createElement('div', 'loader');
            newPlayer.appendChild(loading);

            // TODO: Add "waiting" indicator here?

            // -----------------
            // PLAY/PAUSE BUTTON
            // -----------------
            if (components.playPause) {
                // Create a play/pause button
                let button = PicobelMarkup.createElement('button', 'playerTrigger');
                let buttonText = PicobelMarkup.createElement('span', 'buttonText');
                buttonText.innerHTML = 'play';
                button.appendChild(buttonText);
                // Add the button to the player
                newPlayer.appendChild(button);
            }

            // ---------
            // META DATA
            // ---------
            // Create a wrapper for our player's metadata
            let meta = PicobelMarkup.createElement('div', 'metaWrapper');

            // Create elements to display file metadata
            let meta_title = PicobelMarkup.createElement('span', 'titleDisplay');
            meta_title.innerHTML = 'File ' + (node.key + 1);
            meta.appendChild(meta_title);

            let meta_artist = PicobelMarkup.createElement('span', 'artistDisplay');
            meta.appendChild(meta_artist);

            // Add the metadata to the player
            newPlayer.appendChild(meta);

            // -----------------------------------
            // TIMINGS (PROGRESS, DURATION, TIMER)
            // -----------------------------------
            if (components.progress || components.duration || components.timer) {
                let timings = PicobelMarkup.createElement('div', 'timingsWrapper');

                if (components.timer) {
                    let timer = PicobelMarkup.createElement('span', 'songPlayTimer');
                    timer.innerHTML = '0:00';
                    timings.appendChild(timer);
                }

                if (components.progress) {
                    let progress = PicobelMarkup.buildSlider('progress', 0, 100, 0);
                    timings.appendChild(progress);
                }

                if (components.duration) {
                    let duration = PicobelMarkup.createElement('span', 'songDuration');
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
                let volume = PicobelMarkup.createElement('div', 'songVolume');

                if (components.mute) {
                    let mute = PicobelMarkup.createElement('button', 'songMuteButton');
                    mute.innerHTML = 'Mute';
                    volume.appendChild(mute);
                }

                if (components.volume) {
                    let volume_label_wrapper = PicobelMarkup.createElement(
                        'div',
                        'songVolumeLabelWrapper'
                    );
                    let volume_label = PicobelMarkup.createElement('span', 'songVolumeLabel');
                    volume_label.innerHTML = 'Volume';
                    volume_label_wrapper.appendChild(volume_label);
                    let volume_value = PicobelMarkup.createElement('span', 'songVolumeValue');
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

export const PicobelAudio = {
    setupListeners: nodes =>
        nodes.map((node, key) => {
            node.addEventListener('timeupdate', PicobelAudio.triggerUpdateProgress, false);
            node.addEventListener('loadstart', PicobelAudio.loadStart, false);
            node.addEventListener('canplaythrough', PicobelAudio.canplaythrough, false);
            node.addEventListener('error', PicobelAudio.errors, false);
            node.addEventListener('stalled', PicobelAudio.stalled, false);
            node.addEventListener('waiting', PicobelAudio.errors, false);
            node.addEventListener('progress', PicobelAudio.progress, false);

            node.elements.playPauseButton[0].addEventListener(
                'click',
                PicobelAudio.playPauseAudio,
                false
            );
            node.elements.progressBar[0].addEventListener('input', PicobelAudio.sliderScrub, false);
            node.elements.volumeControl[0].addEventListener('input', PicobelAudio.volume, false);
            node.elements.muteButton[0].addEventListener(
                'click',
                PicobelAudio.muteUnmuteAudio,
                false
            );

            return node;
        }),

    elementHooks: nodes =>
        nodes.map(node => {
            let wrapper = document.querySelectorAll(`[data-song-index='${node.key}']`);
            node.elements = {
                wrapper: wrapper[0],
                playPauseButton: wrapper[0].querySelectorAll('.playerTrigger'),
                muteButton: wrapper[0].querySelectorAll('.songMuteButton'),
                playPauseButtonText: wrapper[0].querySelectorAll('.buttonText'),
                playTimer: wrapper[0].querySelectorAll('.songPlayTimer'),
                durationDisplay: wrapper[0].querySelectorAll('.songDuration'),
                titleDisplay: wrapper[0].querySelectorAll('.titleDisplay'),
                artistDisplay: wrapper[0].querySelectorAll('.artistDisplay'),
                progressBar: wrapper[0].querySelectorAll('.progress-slider__range'),
                playhead: wrapper[0].querySelectorAll('.progress-slider__playhead'),
                indicator: wrapper[0].querySelectorAll('.progress-slider__progress-indicator'),
                volumeControl: wrapper[0].querySelectorAll('.volume-slider__range'),
                volumeDisplay: wrapper[0].querySelectorAll('.songVolumeValue'),
                volumeIndicator: wrapper[0].querySelectorAll('.volume-slider__progress-indicator'),
                volumePlayhead: wrapper[0].querySelectorAll('.volume-slider__playhead')
            };
            return node;
        }),

    triggerUpdateProgress: () => {},
    loadStart: () => {},
    canplaythrough: function() {
        console.log(`canplaythrough ${this.key}`);
        let index = this.key;
        console.log(this.elements);
        PicobelAudio.setLengthDisplay(this);
        this.elements.wrapper.classList.remove('loading');

        // _getMeta(index);
    },
    errors: () => {},
    stalled: () => {},
    errors: () => {},
    progress: () => {},

    // Set the value of the song-length display
    setLengthDisplay(item) {
        let duration = _helpers.parseTime(item.duration);
        item.elements.durationDisplay[0].innerHTML = duration;
    }

    // playPauseAudio: () => {}, false);
    //         node.elements.progressBar.addEventListener('input', sliderScrub, false);
    //         node.elements.volumeControl.addEventListener('input', volume, false);
    //         node.elements.muteButton.addEventListener('click', _muteUnmuteAudio
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

    // Set `components` based on theme (but overridden by explicit `options`).
    state.components = PicobelSetup.setComponentsByTheme(state.theme, rawOptions.components);

    // Get audio elements from page, and save their details to state.
    state.audioNodes = PicobelData.findAudio();

    state.audioNodes = PicobelData.getRawData(state.audioNodes);

    // Build markup for each element, based on `components`
    const markup = PicobelMarkup.generateMarkup(state.audioNodes, state.components);

    // Replace audio elements in DOM with new markup
    _replaceNodes(state.audioNodes, markup);

    // Save new DOM elements to our node list
    state.audioNodes = PicobelAudio.elementHooks(state.audioNodes);
    state.audioNodes = PicobelAudio.setupListeners(state.audioNodes);

    // Replace audio elements in DOM with new markup
    // _replaceNodes(state.audioNodes, markup);

    // state.audioNodes = PicobelAudio.init(state.audioNodes);

    // Setup event listeners

    // Provide methods for external use?

    return {
        state
    };
}

export default Picobel;
