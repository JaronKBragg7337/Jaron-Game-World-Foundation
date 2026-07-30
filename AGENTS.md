# Agent Operating Contract

This repository is the authoritative source for Jaron's approved cross-project game and interactive-world behavior.

## Non-negotiable rule

Do not redesign an approved system.

Before implementing player movement, camera behavior, vehicles, construction snapping, asset placement, surface alignment, collision, scale, or mobile UI, inspect `registry.json` and the corresponding module.

If an implementation can be reused directly, integrate it. If the target engine requires a port, preserve the behavioral contract exactly and document every deviation.

## Required workflow

1. Read `registry.json`.
2. Select only a module compatible with the target engine and platform.
3. Read its `README.md`, `SPEC.md`, `KNOWN_ISSUES.md`, and `test-checklist.md`.
4. Preserve direction conventions, dead zones, pitch limits, safe-area layout, pivots, axis conventions, collision behavior, and test expectations.
5. Run the module's certification tests.
6. Record engine/platform results before proposing `APPROVED` status.

## Lifecycle rules

- `APPROVED`: default choice. Behavior may not be changed incidentally.
- `EXPERIMENTAL`: may be used only when explicitly requested or when no approved module exists.
- `DEPRECATED`: must not be integrated. Read it when necessary to avoid repeating a known failure.

An agent may not promote a module to `APPROVED` merely because it compiles or appears functional. Approval requires the declared test checklist, certification environment, supported-device results, and known limitations.

## Change rules

When changing approved behavior:

- explain why the present contract is insufficient;
- create a new version rather than silently altering expected behavior;
- retain migration notes;
- update `registry.json`;
- update known issues and tests;
- do not break existing projects without an explicit migration plan.

## Shared conventions

Until superseded by an approved module:

- Use right-handed coordinates where the engine permits.
- World up is `+Y`.
- Vehicle and character visual forward is `+Z`.
- Asset pivots belong at the intended ground-contact center unless documented otherwise.
- Touches beginning on UI controls may not rotate the camera.
- Cancelled or lost input must return controls to a neutral state.
- Browser scroll and zoom suppression must be scoped to the interactive game surface.
- Tall structures do not align directly to noisy terrain normals; use foundations or prepared terrain.
- Planetary placement uses a local tangent frame with radial up.

## Repository scope

This repository stores reusable decisions, implementations, tests, examples, and integration contracts. It is not a dumping ground for unrelated assets or project-specific gameplay.
