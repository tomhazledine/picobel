# React performance: baseline → after (Tasks 10–13)

Measurement protocol (deterministic, jsdom): render 10 `<Picobel>` players
in one provider, dispatch `play` then 20 `timeupdate` events (each in its
own act(), modelling separate frames — real audio fires ~4/second) on
player 0, and count:

- **playing-player renders** — render passes of a probe inside player 0
- **idle-sibling renders** — render passes of a probe inside player 9
- **media listener adds** — calls to `HTMLMediaElement.addEventListener`

Harness: `packages/picobel/src/js/react/core/perf.test.tsx` (run
`jest src/js/react/core/perf`). Browser equivalent with live per-player
render rates: demo page `/profiling.html`.

## Baseline — 2026-07-16 (commit range: after Phase 3, before Task 11)

| Metric (per 20 timeupdates) | Value | Real-world equivalent @4 updates/s |
|---|---|---|
| Playing-player renders | 20 | 4 renders/s — expected, its UI moves |
| Idle-sibling renders | **20** | 4 renders/s × every idle player |
| Media listener adds | **1800** | **360 listener add+removes/s** (10 players) |

Why: the provider rebuilds its context value object on every render, and
every `timeupdate` sets state in the provider — so context identity
changes ~4×/s and **every** consumer re-renders. Separately, the listener
effect depends on the `tracks` object its own handlers replace, so all
9 listeners × 10 players tear down and re-attach on every state change
(1800 = 9 × 10 × 20).

Prediction to verify:
- Task 11 (listeners attach once per track): listener adds → **0**
- Task 12 (stable actions context + per-track subscriptions):
  idle-sibling renders → **0**, playing-player renders stays > 0

## After — (to be filled in by Task 13)

| Metric (per 20 timeupdates) | Baseline | After | Change |
|---|---|---|---|
| Playing-player renders | 20 | | |
| Idle-sibling renders | 20 | | |
| Media listener adds | 1800 | | |

Notes / surprises:

- The first harness attempt used React's `<Profiler>` component; under
  jsdom it reported 0 update renders even while a context-consuming probe
  in the same subtree provably rendered 20×. Instrument replaced with
  in-component render counters (measure the mechanism directly, and only
  trust instruments you can explain). Worth reproducing in a browser some
  day to understand what Profiler was (not) counting.
- React batching in action: mounting 10 players fires 10 `registerTrack`
  state updates but only ONE extra render pass (probes counted 2 mount
  renders, not 11).
