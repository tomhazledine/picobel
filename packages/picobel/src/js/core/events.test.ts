import { picobel } from "../Picobel";
import { type AudioElement } from "./data";
import { removeLocalListeners } from "./events";

describe("listener lifecycle", () => {
    beforeEach(() => {
        document.body.innerHTML = '<audio src="test.mp3"></audio>';
    });

    it("responds to media events after setup", () => {
        const { state } = picobel();
        const node = state.audioNodes[0] as AudioElement;
        const wrapper = node.elements!.wrapper;

        expect(wrapper.classList.contains("loading")).toBe(true);
        node.dispatchEvent(new Event("loadedmetadata"));
        expect(wrapper.classList.contains("loading")).toBe(false);
    });

    it("stops responding to media events after removeLocalListeners", () => {
        const { state } = picobel();
        const node = state.audioNodes[0] as AudioElement;
        const wrapper = node.elements!.wrapper;

        removeLocalListeners(node);

        // Still "loading": the loadedmetadata listener must be gone
        node.dispatchEvent(new Event("loadedmetadata"));
        expect(wrapper.classList.contains("loading")).toBe(true);
    });

    it("stops responding to DOM control events after removeLocalListeners", () => {
        const { state } = picobel();
        const node = state.audioNodes[0] as AudioElement;
        // jsdom doesn't implement media playback; stub the boundary
        node.play = jest.fn();
        node.pause = jest.fn();

        const button = node.elements!.playPauseButton;

        button.click();
        expect(node.play).toHaveBeenCalledTimes(1);

        removeLocalListeners(node);

        button.click();
        expect(node.play).toHaveBeenCalledTimes(1);
    });

    it("is safe to call removeLocalListeners twice", () => {
        const { state } = picobel();
        const node = state.audioNodes[0] as AudioElement;

        removeLocalListeners(node);
        expect(() => removeLocalListeners(node)).not.toThrow();
    });
});
