import _helpers from "./helpers";
import PicobelData from "./PicobelData";

const buildSlider = (
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

    let replacement = PicobelMarkup.createElement(
        "div",
        `${namespace}-slider__replacement`
    );

    // Create a background div
    let background = PicobelMarkup.createElement(
        "div",
        `${namespace}-slider__background`
    );
    // Add the background to the container
    replacement.appendChild(background);

    // Create a progress indicator
    let progressIndicator = PicobelMarkup.createElement(
        "div",
        `${namespace}-slider__progress-indicator`
    );
    replacement.appendChild(progressIndicator);

    // Create a "playhead"
    let playhead = PicobelMarkup.createElement(
        "div",
        `${namespace}-slider__playhead`
    );
    replacement.appendChild(playhead);

    wrapper.appendChild(replacement);

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
};

const buildComponent = {
    playPause: () => {
        let button = PicobelMarkup.createElement("button", "playerTrigger");
        let buttonText = PicobelMarkup.createElement("span", "buttonText");
        buttonText.innerHTML = "play";
        button.appendChild(buttonText);
        return button;
    },
    title: node => {
        let title = PicobelMarkup.createElement("span", "titleDisplay");
        title.innerHTML = "File " + (node.key + 1);
        return title;
    },
    artist: () => PicobelMarkup.createElement("span", "artistDisplay"),
    timer: () => {
        let timer = PicobelMarkup.createElement("span", "songPlayTimer");
        timer.innerHTML = "0:00";
        return timer;
    },
    duration: () => {
        let duration = PicobelMarkup.createElement("span", "songDuration");
        duration.innerHTML = "-:--";
        return duration;
    },
    progress: () => buildSlider("progress", 0, 100, 0),
    mute: () => {
        let mute = PicobelMarkup.createElement("button", "songMuteButton");
        mute.innerHTML = "Mute";
        return mute;
    },
    volume: () => {
        let volume = PicobelMarkup.createElement("div", "songVolume");
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

        let volume_slider = buildSlider("volume", 0, 1, 1, 0.1);
        volume.appendChild(volume_slider);
        return volume;
    }
};

export const PicobelMarkup = {
    createElement: (type = "div", className = "") => {
        const newElement = document.createElement(type);
        newElement.className = className;
        return newElement;
    },

    // Set the value of the song-length display
    setLengthDisplay: item => {
        let duration = _helpers.parseTime(item.duration);
        if (item.elements.durationDisplay) {
            item.elements.durationDisplay.innerHTML = duration;
        }
        return item;
    },

    setMeta: (meta, elements) => {
        if (meta.artist && elements.artistDisplay) {
            elements.artistDisplay.innerHTML = meta.artist;
        }
        if (elements.titleDisplay) {
            elements.titleDisplay.innerHTML = meta.title;
        }
        return elements;
    },

    generateMarkup: (nodes = [], components, namespace) => {
        const markupArray = nodes.map(node => {
            // Create a container for our new player
            const newPlayer = PicobelMarkup.createElement("div");

            // Set the relevant classes on the new player element
            const classes = PicobelData.prepareClasses(
                node.key,
                node.className,
                namespace
            );
            newPlayer.classList.add(...classes);

            // Set song index attribute
            newPlayer.setAttribute("data-song-index", node.key);

            // Create a loading indicator
            let loading = PicobelMarkup.createElement("div", "loader");
            newPlayer.appendChild(loading);

            components.forEach(component => {
                if (
                    typeof component === "string" &&
                    buildComponent[component]
                ) {
                    const markup = buildComponent[component](node);
                    newPlayer.appendChild(markup);
                    return;
                }
                if (Array.isArray(component) && component.length) {
                    const wrapper = PicobelMarkup.createElement(
                        "div",
                        `wrapper--${component.join("-")}`
                    );
                    component.forEach(subComponent => {
                        if (buildComponent[subComponent]) {
                            const markup = buildComponent[subComponent](node);
                            wrapper.appendChild(markup);
                        }
                    });
                    newPlayer.appendChild(wrapper);
                }
            });

            return newPlayer;
        });

        return markupArray;
    },

    elementHooks: (nodes, context) =>
        nodes.map(node => {
            let wrapper = context.querySelector(
                `[data-song-index='${node.key}']`
            );
            node.elements = {
                wrapper: wrapper,
                playPauseButton: wrapper.querySelector(".playerTrigger"),
                muteButton: wrapper.querySelector(".songMuteButton"),
                playPauseButtonText: wrapper.querySelector(".buttonText"),
                playTimer: wrapper.querySelector(".songPlayTimer"),
                durationDisplay: wrapper.querySelector(".songDuration"),
                titleDisplay: wrapper.querySelector(".titleDisplay"),
                artistDisplay: wrapper.querySelector(".artistDisplay"),
                progressWrapper: wrapper.querySelector(
                    ".progress-slider__replacement"
                ),
                progressBar: wrapper.querySelector(".progress-slider__range"),
                playhead: wrapper.querySelector(".progress-slider__playhead"),
                indicator: wrapper.querySelector(
                    ".progress-slider__progress-indicator"
                ),
                volumeWrapper: wrapper.querySelector(
                    ".volume-slider__replacement"
                ),
                volumeControl: wrapper.querySelector(".volume-slider__range"),
                volumeDisplay: wrapper.querySelector(".songVolumeValue"),
                volumeIndicator: wrapper.querySelector(
                    ".volume-slider__progress-indicator"
                ),
                volumePlayhead: wrapper.querySelector(
                    ".volume-slider__playhead"
                )
            };
            return node;
        })
};

export default PicobelMarkup;
