# Third-Person Mobile Controls

**Status:** EXPERIMENTAL  
**Version:** 0.1.0  
**Initial reference engine:** Three.js  
**Planned ports:** Unity, Unreal Engine

## Scope

This module defines the approved target behavior for touch-based third-person character movement and camera control. It separates movement ownership, camera ownership, and action-button ownership so simultaneous touches cannot corrupt one another.

## Package contents

- `SPEC.md` — exact behavior and default values
- `KNOWN_ISSUES.md` — known platform hazards and rejected implementations
- `test-checklist.md` — certification procedure
- `src/` — reference implementation, to be built
- `demo/` — minimal module demonstration, to be built

The full certification environment belongs in `examples/control-playground`.

## Approval requirements

This module cannot become `APPROVED` until the implementation passes every required registry test on at least:

- iPhone Safari
- Android Chrome
- desktop Chrome touch emulation for regression only
- one physical controller-capable mobile device where applicable

Desktop emulation does not replace physical-device verification.
