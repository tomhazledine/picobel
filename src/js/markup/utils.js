export const createElement = (type = "div", className = "") => {
    const newElement = document.createElement(type);
    newElement.className = className;
    return newElement;
};
