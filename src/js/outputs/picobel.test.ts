import picobel from "./";

describe("Primary Picobel", () => {
    beforeEach(() => {

        // Reset the document body
        document.body.innerHTML = "";
    });

    it("picobel.js loads and initializes without errors", () => {

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
