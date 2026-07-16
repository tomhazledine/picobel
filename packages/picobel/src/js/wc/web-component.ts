import { picobel } from "../Picobel";
import { type Options } from "../types";

// Create a class for the element
class PicobelWC extends HTMLElement {
    private instance: ReturnType<typeof picobel> | null = null;

    constructor() {
        super();
    }

    connectedCallback() {
        // connectedCallback fires every time the element is inserted
        // (including moves within the document) — guard against double-init.
        if (this.instance) return;
        const className = this.classList[0] || "default";
        const theme = this.getAttribute("data-theme") || className;
        const options: Options = { theme, context: this };
        const components = this.getAttribute("data-components");
        if (components) {
            // Attributes are author input: a JSON typo must not break the
            // player, so fall back to the theme's default components.
            try {
                options.components = JSON.parse(components);
            } catch {
                console.warn(
                    `Picobel: ignoring invalid data-components attribute (not valid JSON): ${components}`
                );
            }
        }
        this.instance = picobel(options);
    }

    disconnectedCallback() {
        this.instance?.destroy();
        this.instance = null;
    }
}

if (typeof window !== "undefined" && "customElements" in window) {
    window.customElements.define("picobel-player", PicobelWC);
}
