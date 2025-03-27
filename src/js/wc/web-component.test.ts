describe("Picobel Web Component", () => {
    beforeEach(async () => {
        // Reset the document body
        document.body.innerHTML = "";
        // Load the distribution
        await import("./web-component");
    });

    it("picobel-component.js loads and initializes without errors", () => {
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

    it("accepts theme configuration via attributes", () => {
        // Create a web component with a custom theme
        document.body.innerHTML =
            '<picobel-player data-theme="custom"><audio src="test.mp3"></audio></picobel-player>';

        // Verify the theme class is applied
        const playerElement = document.querySelector(".picobel");
        expect(playerElement?.classList.contains("custom")).toBe(true);
    });
});
