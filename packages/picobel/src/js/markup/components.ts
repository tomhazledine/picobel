import { buildSlider } from "./slider";
import { createElement } from "./utils";

export const playPause = (namespace: string) => {
    const button = createElement("button", `${namespace}__play-pause`);
    button.setAttribute("type", "button");
    const buttonText = createElement("span", `${namespace}__play-pause__text`);
    buttonText.innerHTML = "Play";
    button.appendChild(buttonText);
    return button;
};

export const title = (namespace: string, key: number) => {
    const title = createElement("span", `${namespace}__title`);
    title.innerHTML = "File " + (key + 1);
    return title;
};

export const artist = (namespace: string) =>
    createElement("span", `${namespace}__artist`);

export const timer = (namespace: string) => {
    const timer = createElement("span", `${namespace}__timer`);
    timer.innerHTML = "0:00";
    return timer;
};

export const duration = (namespace: string) => {
    const duration = createElement("span", `${namespace}__duration`);
    duration.innerHTML = "-:--";
    return duration;
};

export const progress = (namespace: string, key: number) => {
    const label = createElement("span", `${namespace}__progress-label-inner`);
    label.innerHTML = "Progress";
    return buildSlider({
        namespace: `${namespace}__progress`,
        min: 0,
        max: 100,
        value: 0,
        index: key,
        label
    });
};

export const mute = (namespace: string) => {
    const muteEl = createElement("button", `${namespace}__mute`);
    muteEl.setAttribute("type", "button");
    muteEl.innerHTML = "Mute";
    return muteEl;
};

export const volume = (namespace, key) => {
    const volume_label_wrapper = createElement(
        "span",
        `${namespace}__volume-label-inner`
    );
    const volume_label = createElement(
        "span",
        `${namespace}__volume-label-key`
    );
    volume_label.innerHTML = "Volume ";
    volume_label_wrapper.appendChild(volume_label);
    const volume_value = createElement(
        "span",
        `${namespace}__volume-label-value`
    );
    volume_value.innerHTML = "10";
    volume_label_wrapper.appendChild(volume_value);

    const volume_slider = buildSlider({
        namespace: `${namespace}__volume`,
        min: 0,
        max: 1,
        value: 1,
        step: 0.1,
        index: key,
        label: volume_label_wrapper
    });
    return volume_slider;
};
