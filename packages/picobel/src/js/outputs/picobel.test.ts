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

    describe("destroy()", () => {
        const init = () => {
            document.body.innerHTML = '<audio src="test.mp3"></audio>';
            const instance = picobel();
            // jsdom doesn't implement media playback; stub the boundary
            instance.state.audioNodes.forEach(node => {
                node.pause = jest.fn();
            });
            return instance;
        };

        it("removes the player markup and restores the original audio element", () => {
            const instance = init();
            expect(document.querySelectorAll(".picobel").length).toBe(1);
            expect(document.querySelectorAll("audio").length).toBe(0);

            instance.destroy();

            expect(document.querySelectorAll(".picobel").length).toBe(0);
            expect(document.querySelectorAll("audio").length).toBe(1);
        });

        it("pauses the audio", () => {
            const instance = init();
            const node = instance.state.audioNodes[0];

            instance.destroy();

            expect(node.pause).toHaveBeenCalled();
        });

        it("is safe to call twice", () => {
            const instance = init();
            instance.destroy();
            expect(() => instance.destroy()).not.toThrow();
        });

        it("allows picobel to be re-initialized after destroy", () => {
            const instance = init();
            instance.destroy();

            const second = picobel();
            expect(second.state.audioNodes.length).toBe(1);
            expect(document.querySelectorAll(".picobel").length).toBe(1);
        });
    });
});
