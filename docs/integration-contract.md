# Integration Contract

## Purpose

An integration consumes an approved behavior instead of inventing a replacement. Engine-specific code may differ, but user-visible behavior and validation outcomes must remain equivalent.

## Required module contents

Every module must include:

- `README.md` — scope, status, compatibility, and entry points
- `SPEC.md` — exact externally observable behavior
- `KNOWN_ISSUES.md` — verified limitations and failed approaches
- `test-checklist.md` — repeatable certification procedure
- `src/` — reference implementation or port
- `demo/` — smallest playable demonstration when applicable

Empty directories are not preserved by Git. Add implementation files only when that module begins development.

## Integration record

A consuming project should record:

```yaml
module: thirdPersonMobileControls
foundation_version: 0.1.0
module_version: 0.1.0
source_path: controls/mobile/third-person
engine: threejs
platforms:
  - iPhone Safari
  - Desktop Chrome
deviations: []
certification_result: pending
```

## Behavioral equivalence

A port is equivalent only when it preserves:

- input direction and sign;
- camera-relative movement;
- look direction and pitch behavior;
- dead zones, thresholds, sensitivity, and smoothing;
- input ownership and conflict prevention;
- cancel/lost-focus reset behavior;
- collision and grounding outcomes;
- safe-area layout and touch reachability;
- axis, pivot, scale, and orientation conventions.

## Deviations

A deviation must be explicit and include:

1. the original requirement;
2. the target engine or platform limitation;
3. the implemented difference;
4. its user-visible impact;
5. the additional test used to contain the risk.

Undocumented deviations are defects.

## Approval gate

A module remains `EXPERIMENTAL` until:

- its specification is complete;
- its test scene exists;
- all required registry tests pass;
- device and engine coverage is recorded;
- known limitations are documented;
- no unresolved directional, input-conflict, clipping, grounding, or axis defect remains.

Approval is a repository decision and should occur through a dedicated pull request.
