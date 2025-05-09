import styles from "../../../build/picobel.skeleton.css";
import { picobel } from "../Picobel";
import { type Options } from "../types";

// Create a class for the element
class PicobelWC extends HTMLElement {
    constructor() {
        super();
    }

    mountStyles(theme = "skeleton") {
        const styleId = `picobel-styles-${theme}`;
        if (!document.getElementById(styleId)) {
            const styleEl = document.createElement("style");
            styleEl.id = styleId;
            // styleEl.textContent = styles[theme];
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);
        }
    }

    connectedCallback() {
        const theme = this.getAttribute("data-theme") || "skeleton";
        const options: Options = { theme, context: this };
        const components = this.getAttribute("data-components");
        if (components) {
            options.components = JSON.parse(components);
        }
        picobel(options);
        this.mountStyles(theme);
    }
}

if (typeof window !== "undefined" && "customElements" in window) {
    window.customElements.define("picobel-player-skeleton", PicobelWC);
}
