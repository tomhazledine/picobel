import { createElement } from "./utils";

export const buildSlider = ({
    namespace = "picobel",
    min = 0,
    max = 100,
    value = 0,
    step = false,
    index = 0,
    label = "slider"
}) => {
    const container = createElement("div", namespace);
    // Create a container element to hold all the parts
    const wrapper = createElement("div", `${namespace}-slider__wrapper`);

    const replacement = createElement(
        "div",
        `${namespace}-slider__replacement`
    );

    // Create a background div
    const background = createElement("div", `${namespace}-slider__background`);
    // Add the background to the container
    replacement.appendChild(background);

    // Create a progress indicator
    const progressIndicator = createElement(
        "div",
        `${namespace}-slider__indicator`
    );
    replacement.appendChild(progressIndicator);

    // Create a "playhead"
    const playhead = createElement("div", `${namespace}-slider__playhead`);
    replacement.appendChild(playhead);

    wrapper.appendChild(replacement);

    const inputId = `${namespace}-slider__range--${index}`;

    // Create an (invisible) input (html range)
    const progress = createElement("input", `${namespace}-slider__range`);
    progress.setAttribute("id", inputId);
    progress.setAttribute("type", "range");
    progress.setAttribute("min", min);
    progress.setAttribute("max", max);
    progress.setAttribute("value", value);
    if (step) {
        progress.setAttribute("step", step);
    }
    wrapper.appendChild(progress);

    // Create a label
    const inputLabel = createElement("label", `${namespace}-label`);
    if (typeof label === "string") {
        inputLabel.innerHTML = label;
    } else {
        inputLabel.appendChild(label);
    }
    inputLabel.setAttribute("for", inputId);

    container.appendChild(inputLabel);
    container.appendChild(wrapper);

    return container;
};
