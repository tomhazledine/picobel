# Picobel audit fixes — task checklist

Full detail, lessons, and acceptance criteria: see [plan.md](./plan.md).
Rule: one task per commit, failing test first, suite green before ticking.

## Phase 1 — Warm-up: pure-function bugs
- [x] 1. Fix `getFileType`/`getFileName` (dots, query strings) — TDD on `helpers.ts` (72558c6)
- [x] 2. `srcElement` → `event.target`; guard `parseTime(NaN)`; delete dead `checkURL` (35a77a9)
- [x] 3. try/catch `JSON.parse` in web component `connectedCallback` (de5b908)
- [x] ✅ Checkpoint 1: lint + typecheck + 33 tests green (also fixed 8 pre-existing lint errors, a3adb48)

## Phase 2 — Vanilla lifecycle & memory leaks
- [x] 4. AbortController-based listeners; remove no-op `removeEventListener` (2fabdd9)
- [x] 5. `destroy()` API on `picobel()` (pause, abort, restore original audio) (76bd6db)
- [x] 6. `disconnectedCallback` in web component (uses destroy) (2343981)
- [x] 7. Fix index collisions — capture element refs at build time (d9b133c)
- [ ] ✅ Checkpoint 2: DevTools leak verification (getEventListeners, heap snapshot, detached nodes)
      — automated checks green (44 tests); manual browser steps pending human run
      — bonus: demo build fixed for Node 22+ import attributes (e783e38)
      — note: README instructs hot-linking build/ from GitHub ⇒ answers Q1: artifacts ARE load-bearing

## Phase 3 — React correctness
- [ ] 8. Fix stale-closure unmount cleanup; enable `exhaustive-deps` lint
- [ ] 9. Implement per-track `fileStatus` from media events
- [ ] ✅ Checkpoint 3: check green + manual react demo (unmount stops audio)

## Phase 4 — React performance (measure → fix → re-measure)
- [ ] 10. Profiling harness in demo + baseline numbers → `tasks/perf-baseline.md`
- [ ] 11. Stop listener churn (attach once per track)
- [ ] 12. Provider refactor: memoized/split contexts (12a), external store + `useSyncExternalStore` if needed (12b)
- [ ] 13. Re-measure, write up before/after; fix `Range.tsx` derived-state + NaN%
- [ ] ✅ Checkpoint 4: numbers documented, human review of provider diff

## Phase 5 — Polish & hygiene
- [ ] 14. Vanilla fixes: pause-at-0:00, error markup styling, volume/mute simplification
- [ ] 15. Repo hygiene: untrack `build/`, drop `prepublish`, `npm pack --dry-run` audit
- [ ] ✅ Final checkpoint: CHANGELOG, README (`destroy()`), version bump decision

## Open questions (answer before the marked task)
- [ ] Q1 (before 15): are committed `build/` bundles hot-linked anywhere?
- [ ] Q2 (before 12): go all the way to `useSyncExternalStore`, or stop at split contexts?
- [ ] Q3 (before 5): should `destroy()` restore the original `<audio>` tags?
