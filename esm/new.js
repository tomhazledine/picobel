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
            node.mute = false;
            node.tmpVolume = 1;
            return node;
        }),

    // Get info about the audio track
    getMeta: item => {
        let meta = {};
        // Get the filename and type
        meta.url = item.src;
        meta.fileType = _helpers.getFileType(meta.url);
        meta.fileName = _helpers.getFileName(meta.url);
        // If there is a valid title, get that title, otherwise get the file name.
        meta.title = item.title !== '' ? item.title : `${meta.fileName}.${meta.fileType}`;
        // If there is a valid 'artist', get the artist name.
        meta.artist = item.dataset.artist ? item.dataset.artist : false;
        return meta;
    }
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

    // Set the value of the song-length display
    setLengthDisplay: item => {
        let duration = _helpers.parseTime(item.duration);
        item.elements.durationDisplay[0].innerHTML = duration;
    },

    setMeta: (meta, elements) => {
        if (meta.artist) {
            elements.artistDisplay[0].innerHTML = meta.artist;
        }
        elements.titleDisplay[0].innerHTML = meta.title;
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
    },

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
        })
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

    const _setupLocalListeners = nodes =>
        nodes.map((node, key) => {
            // Audio event listeners
            node.addEventListener('timeupdate', audioFunctions.triggerUpdateProgress, false);
            node.addEventListener('loadstart', audioFunctions.loadStart, false);
            node.addEventListener('canplaythrough', audioFunctions.canplaythrough, false);
            node.addEventListener('error', audioFunctions.errors, false);
            node.addEventListener('stalled', audioFunctions.stalled, false);
            node.addEventListener('waiting', audioFunctions.errors, false);
            node.addEventListener('progress', audioFunctions.progress, false);

            // DOM interaction event listeners
            node.elements.playPauseButton[0].addEventListener(
                'click',
                audioFunctions.triggerPlayPauseAudio,
                false
            );
            node.elements.progressBar[0].addEventListener(
                'input',
                audioFunctions.sliderScrub,
                false
            );
            node.elements.volumeControl[0].addEventListener('input', audioFunctions.volume, false);
            node.elements.muteButton[0].addEventListener(
                'click',
                audioFunctions.muteUnmuteAudio,
                false
            );
            return node;
        });

    const audioFunctions = {
        pauseAll: () => {
            const paused = state.audioNodes.map(node => {
                audioFunctions.pause(node);
            });
        },
        triggerPlayPauseAudio: event => {
            let index = _helpers.findParentIndex(event.srcElement);
            let node = state.audioNodes.find(node => node.key == index);
            audioFunctions.playPauseAudio(node);
        },
        playPauseAudio: node => {
            if (node.paused || node.currentTime === 0) {
                audioFunctions.pauseAll();
                audioFunctions.play(node);
            } else {
                audioFunctions.pause(node);
            }
        },
        play: node => {
            node.play();
            let button = node.elements.playPauseButton[0];
            button.classList.remove('songPaused');
            button.classList.add('songPlaying');
        },
        pause: node => {
            node.pause();
            let button = node.elements.playPauseButton[0];
            button.classList.remove('songPlaying');
            button.classList.add('songPaused');
        },
        triggerUpdateProgress: event => audioFunctions.updateProgress(event.srcElement),

        updateProgress: node => {
            let progress = node.currentTime;
            let duration = node.duration;
            let progressParsed = _helpers.parseTime(progress);
            node.elements.playTimer[0].innerHTML = progressParsed;
            if (progress >= duration) {
                node.elements.playPauseButton[0].classList.remove('songPlaying');
            }
            let progressPercent = (progress / duration * 100).toFixed(2);
            node.elements.progressBar[0].value = progressPercent;
            // console.log(node.elements.indicator);
            node.elements.indicator[0].style.width = progressPercent + '%';
            node.elements.playhead[0].style.left = progressPercent + '%';
        },
        loadStart: () => {
            // console.log('loadStart');
        },
        canplaythrough: function() {
            PicobelMarkup.setLengthDisplay(this);
            this.elements.wrapper.classList.remove('loading');
            let meta = PicobelData.getMeta(this);
            PicobelMarkup.setMeta(meta, this.elements);
        },
        errors: error => {
            // console.log(error);
        },
        stalled: () => {
            // console.log('stalled');
        },
        progress: () => {
            // console.log('progress');
        },
        sliderScrub: event => {
            let index = _helpers.findParentIndex(event.srcElement);
            let activeNode = state.audioNodes.find(node => node.key == index);
            let duration = activeNode.duration;
            let targetTime = duration * (event.srcElement.value / 100);
            targetTime = targetTime.toFixed(2);
            activeNode.currentTime = targetTime;
            audioFunctions.updateProgress(activeNode);
        },
        volume: event => {
            let index = _helpers.findParentIndex(event.srcElement);
            let node = state.audioNodes.find(node => node.key == index);
            let volume = event.srcElement.value;
            audioFunctions.mute(node, false);
            audioFunctions.setVolume(node, volume);
        },
        setVolume: (node, value) => {
            let valueMapped = value * 10;
            let volumePercent = value * 100;
            node.volume = value;
            node.elements.volumeDisplay[0].innerHTML = valueMapped;
            node.elements.volumeControl[0].value = value;
            node.elements.volumeIndicator[0].style.width = volumePercent + '%';
            node.elements.volumePlayhead[0].style.left = volumePercent + '%';
        },
        muteUnmuteAudio: event => {
            let index = _helpers.findParentIndex(event.srcElement);
            let node = state.audioNodes.find(node => node.key == index);
            node.mute = !node.mute;
            audioFunctions.mute(node, node.mute);
        },
        mute: (node, mute) => {
            // node.mute = !mute;
            let button = node.elements.muteButton[0];
            if (node.mute) {
                node.tmpVolume = node.volume;
                audioFunctions.setVolume(node, 0);
                button.classList.add('songMuted');
                button.classList.remove('songUnmuted');
                button.innerHTML = 'unmute';
            } else {
                if (typeof node.tmpVolume != 'undefined' && node.tmpVolume > 0) {
                    audioFunctions.setVolume(node, node.tmpVolume);
                } else {
                    audioFunctions.setVolume(node, 1);
                }
                button.classList.remove('songMuted');
                button.classList.add('songUnmuted');
                button.innerHTML = 'mute';
            }
        }
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
    state.audioNodes = PicobelMarkup.elementHooks(state.audioNodes);

    // Setup event listeners
    state.audioNodes = _setupLocalListeners(state.audioNodes);

    return {
        state
    };
}

export default Picobel;
