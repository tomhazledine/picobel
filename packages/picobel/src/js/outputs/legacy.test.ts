import picobel from "./";

declare global {
    interface Window {
        picobel: typeof picobel;
    }
}

describe("Legacy Picobel", () => {
    beforeEach(() => {
        // Clear any global variables between tests
        if (global.picobel) delete global.picobel;

        // Reset the document body
        document.body.innerHTML = "";
    });

    it("loads and initializes without errors", async () => {
        // Load the distribution
        await import(`./legacy`);

        // Verify it exists
        expect(global.picobel).toBeDefined();

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
});
