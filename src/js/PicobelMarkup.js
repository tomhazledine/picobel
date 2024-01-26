import _helpers from "./helpers";
import PicobelData from "./PicobelData";
import * as componentConstructors from "./markup/components";
import { createElement, buildComponents } from "./markup/utils";

export const PicobelMarkup = {
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
            const newPlayer = createElement("div");

            // Set the relevant classes on the new player element
            const classes = PicobelData.prepareClasses(
                node.key,
                node.className,
                namespace
            );
            newPlayer.classList.add(...classes);

            // Set song index attribute
            newPlayer.setAttribute("data-picobel-index", node.key);

            // Create a loading indicator
            let loading = createElement("div", `${namespace}__loader`);
            newPlayer.appendChild(loading);

            // Add the components to the player in the order they are listed
            return buildComponents({
                key: node.key,
                container: newPlayer,
                components,
                namespace
            });
        });

        return markupArray;
    },

    elementHooks: (nodes, context, namespace) =>
        nodes.map(node => {
            let wrapper = context.querySelector(
                `[data-picobel-index='${node.key}']`
            );
            node.elements = {
                wrapper: wrapper,
                playPauseButton: wrapper.querySelector(
                    `.${namespace}__play-pause`
                ),
                playPauseButtonText: wrapper.querySelector(
                    `.${namespace}__play-pause__text`
                ),
                muteButton: wrapper.querySelector(`.${namespace}__mute`),
                playTimer: wrapper.querySelector(`.${namespace}__timer`),
                durationDisplay: wrapper.querySelector(
                    `.${namespace}__duration`
                ),
                titleDisplay: wrapper.querySelector(`.${namespace}__title`),
                artistDisplay: wrapper.querySelector(`.${namespace}__artist`),
                progressWrapper: wrapper.querySelector(
                    `.${namespace}__progress-slider__replacement`
                ),
                progressBar: wrapper.querySelector(
                    `.${namespace}__progress-slider__range`
                ),
                playhead: wrapper.querySelector(
                    `.${namespace}__progress-slider__playhead`
                ),
                indicator: wrapper.querySelector(
                    `.${namespace}__progress-slider__indicator`
                ),
                volumeWrapper: wrapper.querySelector(
                    `.${namespace}__volume-slider__replacement`
                ),
                volumeControl: wrapper.querySelector(
                    `.${namespace}__volume-slider__range`
                ),
                volumeDisplay: wrapper.querySelector(
                    `.${namespace}__volume-label-value`
                ),
                volumeIndicator: wrapper.querySelector(
                    `.${namespace}__volume-slider__indicator`
                ),
                volumePlayhead: wrapper.querySelector(
                    `.${namespace}__volume-slider__playhead`
                )
            };
            return node;
        })
};

export default PicobelMarkup;
