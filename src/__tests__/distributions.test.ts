import picobelForType from "../js/outputs";
import { getPackageVersion } from "../../build.utils.js";
const version = getPackageVersion();

declare global {
    interface Window {
        picobel: typeof picobelForType;
    }
}

describe("Distributions", () => {
    beforeEach(() => {
        // Clear any global variables between tests
        if (global.picobel) delete global.picobel;

        // Reset the document body
        document.body.innerHTML = "";
    });

    it("Legacy Picobel loads and initializes without errors", async () => {
        // Load the distribution
        await import(`../../build/picobel.${version}.js`);

        // Verify it exists
        expect(global.picobel).toBeDefined();

        // Create a simple audio element to test with
        document.body.innerHTML = '<audio src="test.mp3"></audio>';

        // Initialize Picobel
        const instance = global.picobel();

        // Verify it created player elements
        const playerElements = document.querySelectorAll(".picobel");
        expect(playerElements.length).toBeGreaterThan(0);

        expect(instance.state.audioNodes.length).toBe(1);
        expect(instance.state.theme).toBe("default");
        expect(instance.state.components.length).toBe(4);
    });

    it("picobel.js loads and initializes without errors", async () => {
        // Load the distribution
        const picobelModule = await import(`../../build/picobel.js`);
        const picobel = picobelModule.default;

        // Create a simple audio element to test with
        document.body.innerHTML = '<audio src="test.mp3"></audio>';

        // Initialize Picobel
        const instance = picobel();

        // Verify it created player elements
        const playerElements = document.querySelectorAll(".picobel");
        expect(playerElements.length).toBeGreaterThan(0);

        expect(instance.state.audioNodes.length).toBe(1);
        expect(instance.state.theme).toBe("default");
        expect(instance.state.components.length).toBe(4);
    });

    it("picobel-component.js loads and initializes without errors", async () => {
        // Load the distribution using dynamic import with type assertion
        await import("../../build/picobel-component.js" as any);

        // Verify the custom element is defined
        expect(customElements.get("picobel-player")).toBeDefined();

        // Create a simple audio element inside the web component to test with
        document.body.innerHTML =
            '<picobel-player><audio src="test.mp3"></audio></picobel-player>';

        // Verify it created player elements
        const playerElements = document.querySelectorAll(".picobel");
        expect(playerElements.length).toBeGreaterThan(0);

        // Check if the audio is properly wrapped in the player
        const webComponent = document.querySelector("picobel-player");
        expect(webComponent?.querySelector(".picobel")).toBeDefined();
        expect(webComponent?.querySelector("audio")).toBeDefined();
    });
});
