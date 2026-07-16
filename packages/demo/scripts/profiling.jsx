import React from "react";
import { createRoot } from "react-dom/client";
import Picobel, { PicobelProvider, usePicobel } from "picobel/react";

/**
 * Profiling page (Task 10 in tasks/plan.md).
 *
 * Ten players; play any ONE of them and watch the stats table. Each row
 * has a probe component that consumes the Picobel context exactly like
 * the real player sub-components do, and counts its own render passes.
 *
 * Baseline architecture: every probe's count climbs ~4/second while ANY
 * track plays (context identity changes per timeupdate), and the
 * listener counter climbs by hundreds/second (listeners re-attached on
 * every state change). Target architecture: only the playing player's
 * probe moves, and listener adds stay flat after load.
 *
 * Counts are written to the DOM directly on an interval — using React
 * state for the display would itself cause renders and poison the
 * measurement (observer effect).
 */

const TRACK_COUNT = 10;

// ---------------------------------------------------------------------
// Instruments (live outside React so reading them never triggers renders)
// ---------------------------------------------------------------------
const probeRenderCounts = new Array(TRACK_COUNT).fill(0);
let mediaListenerAdds = 0;

const originalAdd = window.HTMLMediaElement.prototype.addEventListener;
window.HTMLMediaElement.prototype.addEventListener = function (...args) {
    mediaListenerAdds++;
    return originalAdd.apply(this, args);
};

const Probe = ({ index }) => {
    const context = usePicobel();
    void context;
    probeRenderCounts[index]++;
    return null;
};

// ---------------------------------------------------------------------
// The page
// ---------------------------------------------------------------------
const App = () => (
    <PicobelProvider>
        {Array.from({ length: TRACK_COUNT }, (_, i) => (
            <React.Fragment key={i}>
                <Picobel
                    id={`profiling-track-${i}`}
                    src="./audio-examples/taken-at-the-flood.mp3"
                    title={`Profiling track ${i + 1}`}
                    artist="Freeze Them"
                />
                <Probe index={i} />
            </React.Fragment>
        ))}
    </PicobelProvider>
);

createRoot(document.getElementById("picobel-react-container")).render(
    <App />
);

// ---------------------------------------------------------------------
// Stats table, updated outside React twice a second
// ---------------------------------------------------------------------
const statsBody = document.getElementById("stats-body");
const listenerCell = document.getElementById("listener-adds");

const rows = probeRenderCounts.map((_, i) => {
    const row = document.createElement("tr");
    const label = document.createElement("td");
    label.textContent = `Player ${i + 1}`;
    const count = document.createElement("td");
    const rate = document.createElement("td");
    row.append(label, count, rate);
    statsBody.appendChild(row);
    return { count, rate };
});

let previousCounts = [...probeRenderCounts];
let previousAdds = 0;
let previousTime = performance.now();

setInterval(() => {
    const now = performance.now();
    const seconds = (now - previousTime) / 1000;

    rows.forEach((cells, i) => {
        const perSecond = (probeRenderCounts[i] - previousCounts[i]) / seconds;
        cells.count.textContent = String(probeRenderCounts[i]);
        cells.rate.textContent = `${perSecond.toFixed(1)}/s`;
        cells.rate.style.fontWeight = perSecond > 0.5 ? "bold" : "normal";
    });

    const addsPerSecond = (mediaListenerAdds - previousAdds) / seconds;
    listenerCell.textContent = `${mediaListenerAdds} total (${addsPerSecond.toFixed(0)}/s)`;

    previousCounts = [...probeRenderCounts];
    previousAdds = mediaListenerAdds;
    previousTime = now;
}, 500);
