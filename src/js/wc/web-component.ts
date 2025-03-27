import { type Options } from "../core/setup";
import { picobel } from "../Picobel";

// Create a class for the element
class PicobelWC extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const className = this.classList[0] || "default";
        const theme = this.getAttribute("data-theme") || className;
        const options: Options = { theme, context: this };
        const components = this.getAttribute("data-components");
        if (components) {
            options.components = JSON.parse(components);
        }
        picobel(options);
    }
}

if (typeof window !== "undefined" && "customElements" in window) {
    window.customElements.define("picobel-player", PicobelWC);
}
