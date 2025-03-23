import * as componentConstructors from "./components";

export const createElement = (type = "div", className = "") => {
    const newElement = document.createElement(type);
    newElement.className = className;
    return newElement;
};

export const buildComponents = ({ key, container, components, namespace }) => {
    // Add the components to the player in the order they are listed
    components.forEach(component => {
        // If the component is a string and we have a function to build it
        // then build it and add it to the player.
        if (typeof component === "string" && componentConstructors[component]) {
            const markup = componentConstructors[component](namespace, key);
            container.appendChild(markup);
            return;
        }
        // If the component is an array, build a wrapper and add each
        // component to the wrapper.
        if (Array.isArray(component) && component.length) {
            const classSuffix = component.flat().join("-");
            const wrapper = createElement(
                "div",
                `${namespace}__wrapper--${classSuffix}`
            );
            const wrapperWithComponents = buildComponents({
                key,
                container: wrapper,
                components: component,
                namespace
            });
            container.appendChild(wrapperWithComponents);
        }
    });

    return container;
};
