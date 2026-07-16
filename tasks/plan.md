# Implementation Plan: Picobel Audit Fixes

A learning-oriented plan to work through the 2026-07 audit findings: memory leaks,
React performance, correctness bugs, and repo hygiene. Each task includes a
**Lesson** section explaining *why* the issue is a bug and the standard tactics
for that class of problem — the goal is to come out the other side understanding
the patterns, not just having applied patches.

## How to work this plan

- One task per session/commit. Every task leaves `main` green (`pnpm --filter=picobel test` passes).
- Bugs get the **Prove-It** treatment: write a failing test that demonstrates the bug
  *first*, watch it fail, then fix. If you can't write a failing test, write down the
  manual reproduction before touching code.
- Performance work follows **measure → fix → re-measure**. No perf refactor lands
  without before/after numbers (Phase 4 builds the harness before allowing the fix).
- Checkpoints between phases are real gates: run them, don't skip them.

## Architecture decisions (made up front so tasks don't re-litigate them)

1. **Listener cleanup via `AbortController`.** Instead of storing every handler
   reference so it can be passed to `removeEventListener` later, register all
   listeners with `addEventListener(type, fn, { signal })` and tear the whole set
   down with one `controller.abort()`. This is the modern standard tactic and it
   makes the `destroy()` API (Task 5) nearly free.
2. **`picobel()` returns a handle with `destroy()`.** Keeps the existing return
   shape (`{ state }`) and adds `destroy`. Non-breaking.
3. **React fix order: correctness → churn → re-render architecture.** The provider
   refactor (Task 12) touches the same files as the listener-churn fix (Task 11);
   doing churn first keeps each diff reviewable and each lesson separate.
4. **`fileStatus` gets implemented, not deleted.** It's the designed loading/error
   UX and wiring it is a good lesson in the media-element event lifecycle. (Flip
   this decision if you'd rather shrink the API.)

---

## Phase 1 — Warm-up: pure-function bugs (low risk, TDD practice)

Small, isolated, easily testable. These build the test-first habit before the
riskier lifecycle work.

### Task 1: Fix `getFileType` / `getFileName` parsing

**Description:** `src/js/utils/helpers.ts:23-34` uses `split(".")[1]`, so
`my.song.mp3` reports type `"song"` and `song.mp3?v=2` reports `"mp3?v=2"`.
These feed the default track title. Parse from the *last* dot and strip
query/hash first.

**Lesson — why this is a bug, and the tactics:**
- `split(".")[1]` encodes the assumption "filenames contain exactly one dot".
  Assumptions like this are invisible until real-world input violates them —
  which is why pure string-parsing functions deserve adversarial test cases
  (dots, no extension, trailing slash, query strings, encoded characters).
- Standard tactics: (a) `fullName.slice(fullName.lastIndexOf(".") + 1)` — parse
  from the end when the *suffix* is what's structured; (b) better, use the
  platform: `new URL(src, window.location.href).pathname` handles query/hash/
  origin for you. Prefer platform parsers over hand-rolled string surgery.

**Acceptance criteria:**
- [ ] `getFileType("path/my.song.mp3?v=2")` → `"mp3"`; `getFileName(...)` → `"my.song"`
- [ ] Extension-less and empty inputs return something sane (no `undefined` in titles)

**Verification:** new failing tests in `helpers.test.ts` written first, then pass; full suite green.
**Dependencies:** none. **Files:** `src/js/utils/helpers.ts`, `src/js/utils/helpers.test.ts`. **Size:** S

### Task 2: Modernize event access + guard `parseTime` + remove dead `checkURL`

**Description:** Replace deprecated `event.srcElement` with `event.target`
(`audio-functions.ts:45,85,95`); make `parseTime(NaN)` return `"0:00"` (or
`"-:--"`) instead of `"NaN:NaN"`; delete unused `checkURL` (`data.ts:66-80`)
which ships a stray `console.log` and fetches whole files just to check
reachability.

**Lesson:**
- `srcElement` is an IE-ism kept alive for compat; `event.target` vs
  `event.currentTarget` is the real distinction worth learning (target = where
  the event originated, currentTarget = where the listener is attached; they
  differ under delegation).
- `duration` is `NaN` until `loadedmetadata` fires — media elements have a
  well-defined readiness lifecycle (`readyState` 0-4) and every read of
  duration/currentTime before readiness needs a guard. NaN is contagious:
  it flows silently through arithmetic into the DOM (`"NaN%"`, `"NaN:NaN"`).
- Dead code with logging isn't neutral: it's API surface someone might call,
  console noise in consumers' apps, and bundle bytes. Deleting code is a
  legitimate fix. (If URL validation is ever wanted, `fetch(url, { method:
  "HEAD" })` checks reachability without downloading the file.)

**Acceptance criteria:**
- [ ] No `srcElement` anywhere in `src/`
- [ ] `parseTime(NaN)` and `parseTime(undefined as any)` return a placeholder, with tests
- [ ] `checkURL` and its `console.log` are gone; no remaining `console.log` in library source

**Verification:** failing `parseTime` test first; grep for `srcElement`/`checkURL` returns nothing; suite green.
**Dependencies:** none. **Files:** `audio-functions.ts`, `helpers.ts` + test, `data.ts`. **Size:** S

### Task 3: Harden web component attribute parsing

**Description:** `wc/web-component.ts:16` calls `JSON.parse` on the
`data-components` attribute with no error handling. Malformed JSON throws inside
`connectedCallback`, killing the player. Wrap in try/catch, warn, and fall back
to theme defaults.

**Lesson:**
- Attributes are user input. Anything read from the DOM (attributes, dataset,
  URL params) is untrusted text and parsing it can fail — same posture as
  parsing network responses.
- Custom-element lifecycle callbacks (`connectedCallback` etc.) should never
  throw: the browser doesn't catch it for you, and one bad attribute can break
  unrelated script on the page. Standard tactic: parse defensively at the
  boundary, degrade gracefully, log a `console.warn` so authors can find the typo.

**Acceptance criteria:**
- [ ] Malformed `data-components` renders the default player and logs a warning; test proves it (this is the known uncovered line 16 in coverage)

**Verification:** failing test in `web-component.test.ts` first; coverage for `web-component.ts` hits 100% lines; suite green.
**Dependencies:** none. **Files:** `wc/web-component.ts`, `wc/web-component.test.ts`. **Size:** XS

### ✅ Checkpoint 1
- [ ] Suite green, no new lint errors (`pnpm --filter=picobel check`)
- [ ] Diff review: three small commits, each with a test written first

---

## Phase 2 — Vanilla lifecycle: the memory-leak work

The core lesson block: listener identity, teardown symmetry, and detached DOM.

### Task 4: Make listeners removable (AbortController) and fix the no-op removal

**Description:** Every listener in `core/events.ts` is an anonymous arrow, so
nothing can ever be removed — and `audio-functions.ts:169` proves it:
`node.removeEventListener("progress", () => handleBuffering(node))` passes a
*brand-new* function, so it removes nothing, silently. Refactor
`_setupLocalListeners` to create one `AbortController` per player, register all
listeners with `{ signal: controller.signal }`, store the controller on the
node (or a module-level `WeakMap<AudioElement, AbortController>`), and delete
the fake `removeEventListener` call in `handleBuffering`.

**Lesson — the heart of the leak findings:**
- Functions are compared **by reference**, not by shape. Two textually identical
  arrow functions are different objects, so `removeEventListener(type, () => …)`
  can never match. This is one of the most common leak patterns in JS and it
  fails *silently* — the API gives no error when nothing matches.
- Classic tactics, in order of ergonomics:
  1. **Named/stored handler**: keep the exact reference, pass it to both add and remove. Works, but bookkeeping grows with listener count.
  2. **`AbortController` signal** (the modern default): `el.addEventListener(t, fn, { signal })`; one `abort()` removes every listener registered with that signal. Batch teardown, no reference bookkeeping.
  3. **Event delegation**: one listener on a stable ancestor, dispatch by `event.target`. Sidesteps per-node cleanup entirely; the tactic behind React's synthetic events.
- Why a `WeakMap` for the controller: it associates data with a DOM node
  *without* preventing that node from being garbage-collected — the canonical
  structure for "metadata about objects I don't own the lifetime of".

**Acceptance criteria:**
- [ ] All listeners in `events.ts` registered with an abort signal; controller retrievable per node
- [ ] The no-op `removeEventListener` in `handleBuffering` is removed
- [ ] Test: after aborting, dispatching `timeupdate`/`progress` on a node no longer mutates its player DOM

**Verification:** new jsdom test (dispatch events pre/post abort); suite green; manual smoke: `pnpm demo:serve`, players still work.
**Dependencies:** Task 2 (touches the same handler code). **Files:** `core/events.ts`, `core/audio-functions.ts`, new test. **Size:** M

### Task 5: Add a `destroy()` API to `picobel()`

**Description:** `picobel()` currently mutates the page irreversibly: it removes
the original `<audio>` elements from the DOM (`Picobel.ts:44-48`) and keeps them
as detached elements driven by closures, with no way to stop playback or release
anything. Return `{ state, destroy }` where `destroy()`: pauses every node,
aborts all listener controllers (Task 4), removes the generated player markup,
re-inserts the original `<audio>` elements where the players were, and clears
`node.elements` references.

**Lesson:**
- **Teardown symmetry**: any library that acquires resources (listeners, DOM,
  timers, observers) must expose the inverse operation. jQuery-era plugins
  skipped this and leaked all over early SPAs; every modern API pairs setup
  with teardown (`observe`/`disconnect`, `setInterval`/`clearInterval`,
  React effect → cleanup return).
- **Detached media elements are special**: an `<audio>` removed from the DOM
  but still referenced — or still *playing* — is kept alive by the browser.
  Remove a Picobel player's markup today and the music keeps playing with no
  handle left to stop it. This is why `destroy()` must `pause()` first.
- **Leak anatomy worth internalizing**: the retention chain here is
  `wrapper DOM → button listener closure → node + nodes array → every player's
  DOM`. One closure capturing `nodes` (plural) makes each player retain *all*
  players. Drawing the retention graph is exactly what DevTools heap snapshots
  do for you (see Checkpoint 2).

**Acceptance criteria:**
- [ ] `const p = picobel(); p.destroy()` restores the original `<audio>` tags to the DOM and removes all `.picobel` wrappers
- [ ] Playing audio stops on destroy
- [ ] Calling `destroy()` twice is a safe no-op
- [ ] Test: post-destroy, dispatching events on the (re-inserted) audio node does not throw or mutate anything

**Verification:** failing tests first (destroy is new API — spec-style tests); suite green; demo smoke test.
**Dependencies:** Task 4. **Files:** `Picobel.ts`, `core/events.ts`, new test, `README.md` (document the API). **Size:** M

### Task 6: Web component teardown (`disconnectedCallback`)

**Description:** `PicobelWC` runs `picobel()` in `connectedCallback` but has no
`disconnectedCallback`, so removing a `<picobel-player>` leaks its whole player
graph and can leave audio playing. Store the instance handle on the element and
call `destroy()` on disconnect.

**Lesson:**
- Custom elements have a real lifecycle contract: `connectedCallback` can fire
  *multiple times* (the element fires it again every time it's moved in the
  DOM), and `disconnectedCallback` is the paired hook. Rule of thumb: anything
  set up in connected must be torn down in disconnected, and connected must be
  idempotent (guard against double-init).
- This is the same teardown-symmetry lesson as Task 5 applied at a different
  layer — notice how a clean core API (`destroy`) makes every wrapper (WC,
  React, future frameworks) trivially correct.

**Acceptance criteria:**
- [ ] Removing a `<picobel-player>` from the DOM stops playback and removes listeners
- [ ] Re-appending the same element re-initializes cleanly (no double players)

**Verification:** jsdom test: append → assert player exists → remove → assert cleanup → re-append → assert exactly one player.
**Dependencies:** Task 5. **Files:** `wc/web-component.ts`, `wc/web-component.test.ts`. **Size:** S

### Task 7: Kill the index-collision bug (stop round-tripping through the DOM)

**Description:** Keys restart at 0 on every `picobel()` call (`data.ts:46`), and
`elementHooks` (`markup/index.ts:57-106`) finds each player by querying the
whole context for `[data-picobel-index='N']` — so a second `picobel()` call on a
page with existing players hooks the new node's controls up to the *first*
player's DOM. Fix by capturing element references at build time: `generateMarkup`
already creates every element, so return the references directly instead of
re-querying by index. Keep a module-level counter (or `crypto.randomUUID()`)
for the index attribute so CSS hooks stay unique.

**Lesson:**
- The bug is an instance of a general anti-pattern: **round-tripping through the
  DOM as a data store**. You built the element, held the reference, threw it
  away, then asked the DOM "find me that element by a string key" — introducing
  a global namespace (the document) where collisions become possible. Rule:
  if you created it, keep the reference; query-selectors are for elements
  *other people* created.
- Where IDs are genuinely needed across boundaries, the tactics are module-level
  monotonic counters (fine within one page load), `crypto.randomUUID()` (fine
  everywhere), or user-supplied IDs (what the React layer does with `id ?? src`).

**Acceptance criteria:**
- [ ] Calling `picobel()` twice (new audio tags added between calls) wires each player to its own DOM — test proves the second batch controls the second batch
- [ ] `elementHooks` no longer does per-player `context.querySelector` by index (or is deleted in favor of build-time refs)

**Verification:** failing multi-invocation test first; suite green; demo smoke.
**Dependencies:** Task 4 (same files in motion). **Files:** `markup/index.ts`, `core/data.ts`, `Picobel.ts`, tests. **Size:** M

### ✅ Checkpoint 2 — manual leak verification (a DevTools lesson in itself)
- [ ] `pnpm demo:build:dev && pnpm demo:serve`, open Chrome DevTools
- [ ] Console: `getEventListeners($0)` on an audio node before/after `destroy()` — listener count drops to 0
- [ ] Memory panel: heap snapshot → filter "Detached" → confirm no detached player wrappers survive a create/destroy cycle (snapshot, destroy, snapshot, compare)
- [ ] Start playback, remove the player via `destroy()` — audio stops
- [ ] Suite + lint green; review diff with human before Phase 3

---

## Phase 3 — React correctness: closures and state lifecycles

### Task 8: Fix the stale-closure unmount cleanup

**Description:** In `react/core/Picobel.tsx:49-55` the register/unregister
effect has `[]` deps. The cleanup therefore captures the *first render's*
`unregisterTrack`, which closed over the initial empty `tracks` object — so on
unmount, `tracks[id]` is `undefined`, the pause branch in
`trackFunctions.ts:42-59` never runs, audio keeps playing, and
`currentlyPlayingId` is never cleared. Changing `src`/`id` also never
re-registers. Fix: make `unregisterTrack` read nothing from the closed-over
`tracks` (pause via the ref that's passed in / do reads inside the `setTracks`
functional updater; clear `currentlyPlayingId` with a functional
`setCurrentlyPlayingId(cur => cur === id ? null : cur)`), and add `id`/`src`
to the effect deps with proper re-registration.

**Lesson — the single most important React mental model:**
- Every render creates a **new set of closures** capturing that render's props
  and state. An effect with `[]` deps runs its setup *and keeps its cleanup*
  from render #1 forever — the cleanup sees the world as it was at mount.
  This isn't a React quirk; it's plain JS closure semantics applied to a
  framework that re-runs your function every render.
- Standard tactics, each with a niche:
  1. **Functional updaters** (`setState(prev => …)`) — when the new state depends on current state, never close over the state value. Fixes most of this file.
  2. **Correct dependency arrays** + the `react-hooks/exhaustive-deps` lint rule (worth enabling in `eslint.config.js` — it would have flagged this line).
  3. **Refs as escape hatches** — a `useRef` that an effect keeps updated gives cleanups access to "latest" values without re-running.
  4. **`useEffectEvent`** (stable in recent React 19) — the framework-blessed version of tactic 3 for event-ish logic inside effects.

**Acceptance criteria:**
- [ ] Unmounting a playing `<Picobel>` pauses its audio and clears `currentlyPlayingId` (test with `@testing-library/react` unmount)
- [ ] Changing `src` re-registers the track under the new id
- [ ] `react-hooks/exhaustive-deps` enabled and passing for touched files

**Verification:** failing unmount test first; suite + lint green.
**Dependencies:** none (parallel-safe with Phase 2). **Files:** `react/core/Picobel.tsx`, `react/tracks/trackFunctions.ts`, `eslint.config.js`, new test. **Size:** M

### Task 9: Implement `fileStatus` (loading/error state for React players)

**Description:** `Picobel.tsx:65` toggles the `loading` class on
`context.fileStatus === "pending"` and the type declares it
(`react/core/types.ts:20`), but nothing ever sets it — React players never show
loading or error states. Move status into per-track state (`track.fileStatus`),
set it from media events in `useTrackEventListeners` (`loadstart` → pending,
`canplay`/`durationchange` → loaded, `error` → error), and read it from the
track, not the context root.

**Lesson:**
- The bug class is **"declared but never assigned"** — the type system can't
  catch it because the field is optional. Tactics: make intent explicit
  (required fields with an initial value), and treat any `?.` read of a field
  you own as a smell — who writes it?
- The media-element loading lifecycle is worth learning properly:
  `loadstart → durationchange → loadedmetadata → canplay → canplaythrough`,
  with `error`/`stalled` as failure branches and `readyState` as the poll-able
  mirror of the same state machine. The vanilla layer already uses these events
  (`events.ts`); this task makes the React layer speak the same language.

**Acceptance criteria:**
- [ ] New `<Picobel>` shows `loading` class until the (mocked) audio fires `canplay`
- [ ] Audio `error` event puts the player into an error state
- [ ] `fileStatus` is per-track, not a phantom root field

**Verification:** failing tests first (fire synthetic media events on the ref'd element); suite green.
**Dependencies:** Task 8 (same files). **Files:** `react/tracks/trackListeners.ts`, `react/core/Picobel.tsx`, `react/core/types.ts`, tests. **Size:** M

### ✅ Checkpoint 3
- [ ] Suite + lint + typecheck green (`pnpm --filter=picobel check`)
- [ ] Manual: react demo page — unmount while playing stops audio; loading class appears and clears

---

## Phase 4 — React performance: measure, then fix the re-render storm

The discipline here **is** the lesson: no optimization lands without numbers.

### Task 10: Build the measurement harness and record a baseline

**Description:** Add a profiling page to the demo package: ~10 `<Picobel>`
players wrapped in React's `<Profiler onRender={log}>`, plus a simple
per-component render counter (a `useRef(0)` incremented each render, dumped to
a table). Play one track for 30 seconds; record renders-per-second per player
and total commit count. Save the numbers in `tasks/perf-baseline.md`.

**Lesson:**
- **Measure first** is the whole discipline of performance work. Intuition
  about "what re-renders" is wrong often enough that React ships three
  measuring tools: the `<Profiler>` component (programmatic), the Profiler tab
  in React DevTools (flamegraphs + "why did this render?"), and
  `console.count` for quick checks. Learn the DevTools Profiler's "record why
  each component rendered" toggle — it names the exact prop/context that
  changed.
- Know what you expect to see before you look: the audit predicts every
  consumer re-renders ~4×/sec while one track plays (context identity churn).
  Confirming a prediction is how you know the model — not just the number — is right.

**Acceptance criteria:**
- [ ] Demo profiling page exists and runs
- [ ] `tasks/perf-baseline.md` records: renders/sec for a *non-playing* player while another plays, total commits over 30s, and listener add/remove counts (wrap `addEventListener` to count)

**Verification:** numbers exist and match/refute the prediction; note surprises.
**Dependencies:** Phase 3 (measure the corrected code). **Files:** `packages/demo` only. **Size:** S

### Task 11: Stop the listener churn in `useTrackEventListeners`

**Description:** `trackListeners.ts:144` depends on `tracks`, and every handler
calls `setTracks`, creating a new `tracks` object → effect re-runs → all six
listeners per track are removed and re-added several times per second while
anything plays. Rework so listeners attach **once per track instance**: depend
on the stable set of track ids/refs (not the state object), use functional
updates inside handlers (they already mostly do), and drop
`currentlyPlayingId` from deps by using functional `setCurrentlyPlayingId`.

**Lesson:**
- The anti-pattern: **an effect that depends on state its own handlers update**
  creates a tight loop of teardown/re-setup. It usually *works* (which is why
  it survives review) but burns CPU and has a real correctness hazard: events
  firing in the gap between remove and re-add are lost.
- Tactics for "effect needs data but shouldn't re-run on it": functional
  updaters (removes the need to read state at all), splitting one big effect
  into per-entity effects keyed by identity, and refs/`useEffectEvent` for
  values handlers need but shouldn't subscribe to. The deep cut: your
  dependency array is a *subscription list*, not a lint chore — choosing deps
  is choosing what re-triggers the effect.

**Acceptance criteria:**
- [ ] Listener add/remove counter (Task 10 harness) shows listeners attached once per track mount, not per state change
- [ ] All existing behavior tests still pass (play/pause/ended/buffered)

**Verification:** re-run harness — listener churn gone; suite green.
**Dependencies:** Task 10. **Files:** `react/tracks/trackListeners.ts`, tests. **Size:** M

### Task 12: Fix the context re-render storm in the provider

**Description:** `provider.tsx:26-49` rebuilds all function groups and a fresh
`contextValue` object every render, and `timeupdate` renders the provider
~4×/sec — so every consumer re-renders constantly while audio plays. Refactor:
(a) memoize the action functions (they should depend only on setters, which are
stable) and split the context in two — a stable **actions context** and a
**state context**; (b) have components subscribe narrowly. If (a)+(b) still
re-renders sibling players (it will, via the state context), take the next
step: store track state in a ref-based external store and expose
`useSyncExternalStore`-based per-track subscription so only the playing
player's components re-render.

**Lesson — the big one for React architecture:**
- Context propagation is triggered by **value identity** (`Object.is`), and a
  fresh object literal every render means "everything changed" every render.
  First-line tactics: `useMemo` the value; split contexts by *change frequency*
  (stable actions vs. hot state) — the classic Kent C. Dodds
  state/dispatch-context split, and the same reasoning behind Redux's separate
  `dispatch`.
- The deeper principle: **match the subscription granularity to the update
  frequency**. `currentTime` at 4Hz is the hottest state in the app; putting it
  in a context consumed by everything means everything runs at 4Hz. Libraries
  like Zustand/Jotai exist precisely to give per-slice subscriptions;
  `useSyncExternalStore` is the platform primitive underneath them and worth
  learning by using it once, here.
- Also visible in this refactor: `getTrackState` etc. are recreated per render
  as a *workaround* for not having stable state access — with a store, getters
  become subscriptions and the function-group factories mostly dissolve.

**Acceptance criteria:**
- [ ] While track A plays, track B's components render ~0 times/sec (harness proof)
- [ ] Actions context value is referentially stable across renders
- [ ] All React behavior tests pass unchanged (public API unchanged)

**Verification:** harness before/after in `tasks/perf-baseline.md`; suite green; react demo manually exercised.
**Dependencies:** Tasks 10, 11. **Files:** `react/core/provider.tsx`, `react/core/useTrackState.ts`, possibly a new `store.ts`, tests. **Size:** L (if it grows, split: 12a memoize+split contexts, 12b external store)

### Task 13: Re-measure and write up the perf result

**Description:** Re-run the Task 10 protocol, append after-numbers and a short
write-up (what changed, by how much, what surprised you) to
`tasks/perf-baseline.md`. Also fold the `Range.tsx` cleanup in here: delete the
`percentageComplete` state + sync effect (compute inline) and guard the
`max=0 → NaN%` case.

**Lesson:**
- Closing the loop is what separates "I refactored" from "I made it faster".
  The write-up is the artifact you'd attach to a PR description or blog post.
- `Range.tsx` is the textbook **derived state** anti-pattern: state + effect to
  mirror a prop causes an extra render per update and can flash stale values.
  Rule: if it can be computed from props/state during render, compute it during
  render. (The React docs call this "you might not need an effect" — worth reading.)

**Acceptance criteria:**
- [ ] Before/after table committed; non-playing players at ~0 renders/sec
- [ ] `Range.tsx` has no state-mirroring effect and never renders `NaN%`

**Verification:** harness numbers; suite green.
**Dependencies:** Task 12. **Files:** `tasks/perf-baseline.md`, `react/core/Range.tsx`, test. **Size:** S

### ✅ Checkpoint 4
- [ ] Before/after numbers documented and healthy
- [ ] `pnpm --filter=picobel check` green; both demo pages manually exercised
- [ ] Human review of the provider refactor diff

---

## Phase 5 — Polish and hygiene

### Task 14: Small vanilla behavior fixes

**Description:** Three leftovers: (a) `playPauseAudio` (`audio-functions.ts:11`)
treats `currentTime === 0` as "should play", so pausing at 0:00 restarts —
decide by `node.paused` alone; (b) `errors()` (`audio-functions.ts:80`) injects
inline-styled HTML — move styles to the theme CSS and build elements instead of
an HTML string; (c) simplify the `volume()`/`mute()` dance (`:94-147`), which
double-sets volume on every slider input and shadows the platform's own
`muted` property with a custom `mute` — consider using `node.muted` directly.

**Lesson:**
- (a) is about **deriving state from the source of truth**: the media element
  already knows if it's paused; adding `currentTime === 0` invented a second,
  conflicting source.
- (c) same lesson at API scale: the platform already models mute/volume
  (`muted`, `volume`, `volumechange` event). Shadowing platform state in
  parallel variables (`node.mute`, `node.tmpVolume`) invites drift; wrapping
  platform state and listening to `volumechange` cannot drift.

**Acceptance criteria:**
- [ ] Pause works at `currentTime === 0` (test)
- [ ] No inline styles injected from JS; error state styled via CSS
- [ ] Volume slider input sets volume exactly once; mute/unmute round-trips preserve slider position (tests)

**Verification:** failing tests first for (a)/(c); suite green; demo smoke.
**Dependencies:** Phase 2 done (same files). **Files:** `core/audio-functions.ts`, CSS, tests. **Size:** M

### Task 15: Repo and packaging hygiene

**Description:** (a) Stop committing build artifacts: gitignore
`packages/picobel/build/`, delete tracked bundles (**see open question first**),
rely on `prepublishOnly` to build for npm; (b) drop the deprecated `prepublish`
script (keep `prepublishOnly`); (c) verify the published package contains what
it should (`npm pack --dry-run`).

**Lesson:**
- Git stores every version of every file forever; committed bundles (already
  ~6 historical versions here) grow clone size permanently — history rewrites
  are the only undo, and they're disruptive. The ecosystem norm: source in git,
  artifacts in the registry, `files`/`.npmignore` controlling the tarball, and
  `npm pack --dry-run` as the verification tool.
- `prepublish` vs `prepublishOnly` is npm lifecycle trivia with a real lesson:
  npm's lifecycle hooks have historical footguns (`prepublish` used to run on
  plain `npm install`), so always check semantics rather than pattern-matching
  hook names.

**Acceptance criteria:**
- [ ] `build/` untracked going forward; CI/publish flow still works (`pnpm build` then `npm pack --dry-run` shows correct contents)
- [ ] No `prepublish` script

**Verification:** `npm pack --dry-run` output reviewed; fresh clone + build works.
**Dependencies:** none, but do last (touches release plumbing). **Files:** `.gitignore`, `package.json`, deletions. **Size:** S

### ✅ Final checkpoint
- [ ] Full `check` green; both demos exercised; heap-snapshot spot check repeated
- [ ] CHANGELOG/README updated for the new `destroy()` API and any behavior changes
- [ ] Decide: patch vs minor version (new API ⇒ minor)

---

## Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Provider refactor (T12) breaks React API for existing users | High | Behavior tests before refactor; keep public component/hook signatures identical; split into 12a/12b |
| `destroy()` DOM restoration fights frameworks that own the DOM around it | Med | Restore only what picobel removed; document that SPA users should call destroy before unmounting the region |
| jsdom can't simulate real media playback (no actual audio decode) | Med | Test via synthetic events (`dispatchEvent(new Event("timeupdate"))`); pair with manual demo checks at checkpoints |
| Removing committed build files breaks consumers hot-linking from GitHub/CDN raw URLs | Med | **Open question below — check before deleting** |

## Open questions (answer before the relevant task)

1. **Task 15:** Are the committed `build/` bundles load-bearing? (e.g. jsDelivr/
   raw.githubusercontent links in old blog posts or the picobel site.) If yes:
   keep latest-version artifacts, delete only stale ones, or move hosting to
   npm-backed jsDelivr (`cdn.jsdelivr.net/npm/picobel@3/…`).
2. **Task 12:** Happy to take on `useSyncExternalStore` (12b), or stop at
   memoized split contexts (12a) if you want a smaller change?
3. **Task 5:** Should `destroy()` restore the original `<audio>` elements
   (plan's assumption) or just remove the players and leave the audio out of
   the DOM?
