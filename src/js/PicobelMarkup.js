import _helpers from "./helpers";
import PicobelData from "./PicobelData";

export const PicobelMarkup = {
    // Create markup for a custom slider
    buildSlider: (
        namespace = "picobel",
        min = 0,
        max = 100,
        value = 0,
        step = false
    ) => {
        // Create a container element to hold all the parts
        let wrapper = PicobelMarkup.createElement(
            "div",
            `${namespace}-slider__wrapper`
        );

        // Create a background div
        let background = PicobelMarkup.createElement(
            "div",
            `${namespace}-slider__background`
        );
        // Add the background to the container
        wrapper.appendChild(background);

        // Create a progress indicator
        let progressIndicator = PicobelMarkup.createElement(
            "div",
            `${namespace}-slider__progress-indicator`
        );
        wrapper.appendChild(progressIndicator);

        // Create a "playhead"
        let playhead = PicobelMarkup.createElement(
            "div",
            `${namespace}-slider__playhead`
        );
        wrapper.appendChild(playhead);

        // Create an (invisible) input (html range)
        let progress = PicobelMarkup.createElement(
            "input",
            `${namespace}-slider__range`
        );
        progress.type = "range";
        progress.min = min;
        progress.max = max;
        progress.value = value;
        if (step) {
            progress.step = step;
        }
        wrapper.appendChild(progress);

        return wrapper;
    },

    createElement: (type = "div", className = "") => {
        const newElement = document.createElement(type);
        newElement.className = className;
        return newElement;
    },

    // Set the value of the song-length display
    setLengthDisplay: item => {
        let duration = _helpers.parseTime(item.duration);
        item.elements.durationDisplay[0].innerHTML = duration;
        return item;
    },

    setMeta: (meta, elements) => {
        if (meta.artist) {
            elements.artistDisplay[0].innerHTML = meta.artist;
        }
        elements.titleDisplay[0].innerHTML = meta.title;
        return elements;
    },

    generateMarkup: (nodes = [], components) => {
        const markupArray = nodes.map(node => {
            // Create a container for our new player
            const newPlayer = PicobelMarkup.createElement("div");

            // Set the relevant classes on the new player element
            const classes = PicobelData.prepareClasses(
                node.key,
                node.className,
                components.theme
            );
            newPlayer.classList.add(...classes);

            // Set song index attribute
            newPlayer.setAttribute("data-song-index", node.key);

            // Create a loading indicator
            let loading = PicobelMarkup.createElement("div", "loader");
            newPlayer.appendChild(loading);

            // TODO: Add "waiting" indicator here?

            // -----------------
            // PLAY/PAUSE BUTTON
            // -----------------
            if (components.playPause) {
                // Create a play/pause button
                let button = PicobelMarkup.createElement(
                    "button",
                    "playerTrigger"
                );
                let buttonText = PicobelMarkup.createElement(
                    "span",
                    "buttonText"
                );
                buttonText.innerHTML = "play";
                button.appendChild(buttonText);
                // Add the button to the player
                newPlayer.appendChild(button);
            }

            // ---------
            // META DATA
            // ---------
            // Create a wrapper for our player's metadata
            let meta = PicobelMarkup.createElement("div", "metaWrapper");

            // Create elements to display file metadata
            let meta_title = PicobelMarkup.createElement(
                "span",
                "titleDisplay"
            );
            meta_title.innerHTML = "File " + (node.key + 1);
            meta.appendChild(meta_title);

            let meta_artist = PicobelMarkup.createElement(
                "span",
                "artistDisplay"
            );
            meta.appendChild(meta_artist);

            // Add the metadata to the player
            newPlayer.appendChild(meta);

            // -----------------------------------
            // TIMINGS (PROGRESS, DURATION, TIMER)
            // -----------------------------------
            if (
                components.progress ||
                components.duration ||
                components.timer
            ) {
                let timings = PicobelMarkup.createElement(
                    "div",
                    "timingsWrapper"
                );

                if (components.timer) {
                    let timer = PicobelMarkup.createElement(
                        "span",
                        "songPlayTimer"
                    );
                    timer.innerHTML = "0:00";
                    timings.appendChild(timer);
                }

                if (components.progress) {
                    let progress = PicobelMarkup.buildSlider(
                        "progress",
                        0,
                        100,
                        0
                    );
                    timings.appendChild(progress);
                }

                if (components.duration) {
                    let duration = PicobelMarkup.createElement(
                        "span",
                        "songDuration"
                    );
                    duration.innerHTML = "-:--";
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
                let volume = PicobelMarkup.createElement("div", "songVolume");

                if (components.mute) {
                    let mute = PicobelMarkup.createElement(
                        "button",
                        "songMuteButton"
                    );
                    mute.innerHTML = "Mute";
                    volume.appendChild(mute);
                }

                if (components.volume) {
                    let volume_label_wrapper = PicobelMarkup.createElement(
                        "div",
                        "songVolumeLabelWrapper"
                    );
                    let volume_label = PicobelMarkup.createElement(
                        "span",
                        "songVolumeLabel"
                    );
                    volume_label.innerHTML = "Volume";
                    volume_label_wrapper.appendChild(volume_label);
                    let volume_value = PicobelMarkup.createElement(
                        "span",
                        "songVolumeValue"
                    );
                    volume_value.innerHTML = "10";
                    volume_label_wrapper.appendChild(volume_value);
                    volume.appendChild(volume_label_wrapper);

                    let volume_slider = PicobelMarkup.buildSlider(
                        "volume",
                        0,
                        1,
                        1,
                        0.1
                    );
                    volume.appendChild(volume_slider);
                }
                newPlayer.appendChild(volume);
            }

            return newPlayer;
        });

        return markupArray;
    },

    elementHooks: (nodes, context) =>
        nodes.map(node => {
            let wrapper = context.querySelectorAll(
                `[data-song-index='${node.key}']`
            );
            node.elements = {
                wrapper: wrapper[0],
                playPauseButton: wrapper[0].querySelectorAll(".playerTrigger"),
                muteButton: wrapper[0].querySelectorAll(".songMuteButton"),
                playPauseButtonText: wrapper[0].querySelectorAll(".buttonText"),
                playTimer: wrapper[0].querySelectorAll(".songPlayTimer"),
                durationDisplay: wrapper[0].querySelectorAll(".songDuration"),
                titleDisplay: wrapper[0].querySelectorAll(".titleDisplay"),
                artistDisplay: wrapper[0].querySelectorAll(".artistDisplay"),
                progressBar: wrapper[0].querySelectorAll(
                    ".progress-slider__range"
                ),
                playhead: wrapper[0].querySelectorAll(
                    ".progress-slider__playhead"
                ),
                indicator: wrapper[0].querySelectorAll(
                    ".progress-slider__progress-indicator"
                ),
                volumeControl: wrapper[0].querySelectorAll(
                    ".volume-slider__range"
                ),
                volumeDisplay: wrapper[0].querySelectorAll(".songVolumeValue"),
                volumeIndicator: wrapper[0].querySelectorAll(
                    ".volume-slider__progress-indicator"
                ),
                volumePlayhead: wrapper[0].querySelectorAll(
                    ".volume-slider__playhead"
                )
            };
            return node;
        })
};

export default PicobelMarkup;
