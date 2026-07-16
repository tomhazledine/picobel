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

    it("renders the default player when data-components is malformed JSON", () => {
        const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

        // Trailing comma makes this invalid JSON
        document.body.innerHTML =
            '<picobel-player data-components=\'["playPause",]\'><audio src="test.mp3"></audio></picobel-player>';

        // The player should still be built…
        const playerElements = document.querySelectorAll(".picobel");
        expect(playerElements.length).toBeGreaterThan(0);

        // …and the author should be told why their components were ignored
        expect(warn).toHaveBeenCalled();

        warn.mockRestore();
    });

    it("tears down the player when removed from the DOM", () => {
        const pause = jest
            .spyOn(window.HTMLMediaElement.prototype, "pause")
            .mockImplementation(() => {});

        document.body.innerHTML =
            '<picobel-player><audio src="test.mp3"></audio></picobel-player>';
        const webComponent = document.querySelector(
            "picobel-player"
        ) as HTMLElement;
        expect(webComponent.querySelector(".picobel")).not.toBeNull();

        document.body.removeChild(webComponent);

        // Player markup gone, original audio restored, playback stopped
        expect(webComponent.querySelector(".picobel")).toBeNull();
        expect(webComponent.querySelector("audio")).not.toBeNull();
        expect(pause).toHaveBeenCalled();

        pause.mockRestore();
    });

    it("re-initializes cleanly when re-appended to the DOM", () => {
        const pause = jest
            .spyOn(window.HTMLMediaElement.prototype, "pause")
            .mockImplementation(() => {});

        document.body.innerHTML =
            '<picobel-player><audio src="test.mp3"></audio></picobel-player>';
        const webComponent = document.querySelector(
            "picobel-player"
        ) as HTMLElement;

        document.body.removeChild(webComponent);
        document.body.appendChild(webComponent);

        // Exactly one player: no doubling, no dead markup. The <audio>
        // element is held detached while a player is active, so it should
        // NOT be in the DOM after re-initialization.
        expect(webComponent.querySelectorAll(".picobel").length).toBe(1);
        expect(webComponent.querySelectorAll("audio").length).toBe(0);

        pause.mockRestore();
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
