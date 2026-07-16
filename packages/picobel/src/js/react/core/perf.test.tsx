import { act, render } from "@testing-library/react";
import React from "react";

import { Picobel } from "./Picobel";
import { PicobelProvider } from "./provider";
import { useTrackState } from "./useTrackState";

/**
 * Performance characterization harness (Task 10 in tasks/plan.md).
 *
 * Renders a playlist of players, simulates one track playing (a burst of
 * `timeupdate` events, each in its own act() to model separate frames —
 * real audio fires ~4/second), and measures two things:
 *
 *   1. how many times components inside IDLE sibling players re-render
 *   2. how many media event listeners get (re)attached
 *
 * Renders are counted by a probe component placed inside each player that
 * consumes track state exactly the way the real sub-components
 * (PlayPause, CurrentTime, …) do — so the counts measure the update
 * mechanism itself, not an abstraction over it.
 *
 * The expectations encode the INTENDED architecture: idle players don't
 * re-render and listeners attach once. Numbers are logged so before/after
 * values can be recorded in tasks/perf-baseline.md.
 */

const TRACK_COUNT = 10;
const TIMEUPDATE_COUNT = 20;

const renderCounts: Record<string, number> = {};

// Consumes track state like every real player sub-component does, and
// counts its own render passes.
const TrackProbe = ({ probeId }: { probeId: string }) => {
    renderCounts[probeId] = (renderCounts[probeId] ?? 0) + 1;
    const track = useTrackState({ name: "TrackProbe" });
    void track;
    return null;
};

describe("render and listener behavior while one track plays", () => {
    let play: jest.SpyInstance;
    let pause: jest.SpyInstance;

    beforeEach(() => {
        play = jest
            .spyOn(window.HTMLMediaElement.prototype, "play")
            .mockImplementation(() => Promise.resolve());
        pause = jest
            .spyOn(window.HTMLMediaElement.prototype, "pause")
            .mockImplementation(() => {});
        Object.keys(renderCounts).forEach(key => delete renderCounts[key]);
    });

    afterEach(() => {
        play.mockRestore();
        pause.mockRestore();
    });

    const runPlaybackScenario = () => {
        const addSpy = jest.spyOn(
            window.HTMLMediaElement.prototype,
            "addEventListener"
        );

        const { container } = render(
            <PicobelProvider>
                {Array.from({ length: TRACK_COUNT }, (_, i) => (
                    <Picobel key={i} src={`track-${i}.mp3`}>
                        <TrackProbe probeId={`player-${i}`} />
                    </Picobel>
                ))}
            </PicobelProvider>
        );

        const audio = container.querySelectorAll("audio")[0];
        act(() => {
            audio.dispatchEvent(new Event("play"));
        });

        // Setup has settled: zero the counters, then simulate playback.
        Object.keys(renderCounts).forEach(key => delete renderCounts[key]);
        addSpy.mockClear();

        for (let i = 0; i < TIMEUPDATE_COUNT; i++) {
            act(() => {
                audio.dispatchEvent(new Event("timeupdate"));
            });
        }

        const measurements = {
            playingRenders: renderCounts["player-0"] ?? 0,
            siblingRenders: renderCounts["player-9"] ?? 0,
            listenerAdds: addSpy.mock.calls.length
        };
        addSpy.mockRestore();

        console.log(
            `[perf] ${TIMEUPDATE_COUNT} timeupdates on 1 of ${TRACK_COUNT} players → ` +
                `playing-player renders: ${measurements.playingRenders}, ` +
                `idle-sibling renders: ${measurements.siblingRenders}, ` +
                `media listener adds: ${measurements.listenerAdds}`
        );

        return measurements;
    };

    // `it.failing` = the current architecture is known to fail this spec;
    // jest goes red if it unexpectedly starts PASSING. When the fix lands
    // (Task 11), remove `.failing` so it becomes a regression guard.
    it.failing("attaches media listeners once, not per state change", () => {
        const { listenerAdds } = runPlaybackScenario();
        expect(listenerAdds).toBe(0);
    });

    // Same deal: flips to a normal `it` in Task 12.
    it.failing("does not re-render idle sibling players", () => {
        const { playingRenders, siblingRenders } = runPlaybackScenario();

        // The playing player must keep updating (its timer/progress move)…
        expect(playingRenders).toBeGreaterThan(0);
        // …but idle siblings must not render at all.
        expect(siblingRenders).toBe(0);
    });
});
