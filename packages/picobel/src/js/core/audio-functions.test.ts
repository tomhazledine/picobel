import { picobel } from "../Picobel";
import { type AudioElement } from "./data";

const initPlayer = () => {
    document.body.innerHTML = '<audio src="test.mp3"></audio>';
    const { state } = picobel();
    const node = state.audioNodes[0] as AudioElement;
    // jsdom doesn't implement media playback; stub the boundary
    node.play = jest.fn();
    node.pause = jest.fn();
    return node;
};

// Make the read-only `paused` property report a chosen value.
const setPaused = (node: AudioElement, paused: boolean) =>
    Object.defineProperty(node, "paused", {
        value: paused,
        configurable: true
    });

describe("play/pause control", () => {
    it("pauses a playing track even when currentTime is 0", () => {
        const node = initPlayer();
        setPaused(node, false); // playing, but still at 0:00
        expect(node.currentTime).toBe(0);

        node.elements!.playPauseButton.click();

        // The element already knows it isn't paused — currentTime must
        // not overrule it and restart playback.
        expect(node.pause).toHaveBeenCalled();
        expect(node.play).not.toHaveBeenCalled();
    });

    it("plays a paused track", () => {
        const node = initPlayer();
        setPaused(node, true);

        node.elements!.playPauseButton.click();

        expect(node.play).toHaveBeenCalled();
    });
});

describe("volume and mute", () => {
    const setSliderVolume = (node: AudioElement, value: number) => {
        const slider = node.elements!.volumeControl as HTMLInputElement;
        slider.value = String(value);
        slider.dispatchEvent(new Event("input"));
    };

    it("sets the element volume exactly once per slider input", () => {
        const node = initPlayer();

        const volumeWrites: number[] = [];
        Object.defineProperty(node, "volume", {
            configurable: true,
            get: () => volumeWrites[volumeWrites.length - 1] ?? 1,
            set: value => {
                volumeWrites.push(value);
            }
        });

        setSliderVolume(node, 0.4);

        expect(volumeWrites).toEqual([0.4]);
    });

    it("restores the previous volume on a mute/unmute round-trip", () => {
        const node = initPlayer();
        setSliderVolume(node, 0.4);
        const muteButton = node.elements!.muteButton;

        muteButton.click();
        expect(node.volume).toBe(0);
        expect(muteButton.innerHTML).toBe("Unmute");
        expect(muteButton.classList.contains("muted")).toBe(true);

        muteButton.click();
        expect(node.volume).toBe(0.4);
        expect(muteButton.innerHTML).toBe("Mute");
        expect(muteButton.classList.contains("muted")).toBe(false);
    });

    it("unmutes when the volume slider is moved while muted", () => {
        const node = initPlayer();
        setSliderVolume(node, 0.4);
        node.elements!.muteButton.click(); // muted, volume 0

        setSliderVolume(node, 0.6);

        expect(node.mute).toBe(false);
        expect(node.volume).toBe(0.6);
        expect(node.elements!.muteButton.innerHTML).toBe("Mute");
    });
});

describe("error state", () => {
    it("renders the error message without inline styles", () => {
        const node = initPlayer();

        node.dispatchEvent(new Event("error"));

        const wrapper = node.elements!.wrapper;
        expect(wrapper.classList.contains("error")).toBe(true);
        expect(wrapper.classList.contains("loading")).toBe(false);

        const errorEl = wrapper.querySelector(".error");
        expect(errorEl).not.toBeNull();
        expect(errorEl!.getAttribute("style")).toBeNull();
        expect(wrapper.textContent).toContain("Error loading audio file");
    });
});
