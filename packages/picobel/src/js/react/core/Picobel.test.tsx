import { act, render, screen } from "@testing-library/react";
import React from "react";

import { Picobel } from "./Picobel";
import { PicobelProvider, usePicobel } from "./provider";

// Small probe rendered alongside the players so tests can observe the
// provider's state from outside an unmounted subtree.
const Probe = () => {
    const context = usePicobel();
    return (
        <>
            <div data-testid="current-id">
                {String(context!.getCurrentlyPlayingId())}
            </div>
            <div data-testid="track-ids">
                {Object.keys(context!.getAllTracks()).join(",")}
            </div>
        </>
    );
};

describe("Picobel React lifecycle", () => {
    let play: jest.SpyInstance;
    let pause: jest.SpyInstance;

    beforeEach(() => {
        // jsdom doesn't implement media playback; stub the boundary
        play = jest
            .spyOn(window.HTMLMediaElement.prototype, "play")
            .mockImplementation(() => Promise.resolve());
        pause = jest
            .spyOn(window.HTMLMediaElement.prototype, "pause")
            .mockImplementation(() => {});
    });

    afterEach(() => {
        play.mockRestore();
        pause.mockRestore();
    });

    it("pauses the audio when a playing player unmounts", () => {
        const { container, unmount } = render(
            <PicobelProvider>
                <Picobel src="test.mp3" />
            </PicobelProvider>
        );

        const audio = container.querySelector("audio")!;
        act(() => {
            audio.dispatchEvent(new Event("play"));
        });

        unmount();

        expect(pause).toHaveBeenCalled();
    });

    it("clears currentlyPlayingId when the playing player unmounts", () => {
        const { container, rerender } = render(
            <PicobelProvider>
                <Picobel src="test.mp3" />
                <Probe />
            </PicobelProvider>
        );

        const audio = container.querySelector("audio")!;
        act(() => {
            audio.dispatchEvent(new Event("play"));
        });
        expect(screen.getByTestId("current-id").textContent).toBe("test.mp3");

        // Remove the player but keep the provider mounted
        rerender(
            <PicobelProvider>
                <Probe />
            </PicobelProvider>
        );

        expect(screen.getByTestId("current-id").textContent).toBe("null");
        expect(screen.getByTestId("track-ids").textContent).toBe("");
    });

    it("re-registers the track when src changes", () => {
        const { rerender } = render(
            <PicobelProvider>
                <Picobel src="first.mp3" />
                <Probe />
            </PicobelProvider>
        );
        expect(screen.getByTestId("track-ids").textContent).toBe("first.mp3");

        rerender(
            <PicobelProvider>
                <Picobel src="second.mp3" />
                <Probe />
            </PicobelProvider>
        );

        expect(screen.getByTestId("track-ids").textContent).toBe("second.mp3");
    });
});
