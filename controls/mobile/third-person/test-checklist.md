# Third-Person Mobile Control Certification

Record the device, operating system, browser, engine version, commit SHA, orientation, and observed result for every run.

## Direction and movement

- [ ] Stick up moves toward the camera's horizontal aim direction.
- [ ] Stick down moves away from that direction.
- [ ] Stick left moves screen-left.
- [ ] Stick right moves screen-right.
- [ ] Camera pitch does not alter or reverse the movement plane.
- [ ] Dead-zone input produces no drift.
- [ ] Movement magnitude increases smoothly outside the dead zone.
- [ ] Run begins at the declared threshold.
- [ ] Character rotates toward movement without snapping or oscillation.

## Camera

- [ ] Drag right rotates the view right.
- [ ] Drag left rotates the view left.
- [ ] Drag up looks upward.
- [ ] Drag down looks downward.
- [ ] Pitch stops at both declared limits.
- [ ] Camera cannot flip.
- [ ] Walls, corners, low ceilings, and crowded props do not permit camera clipping.
- [ ] Camera returns smoothly from collision compression.

## Multi-touch and interruption

- [ ] Movement and look work simultaneously.
- [ ] Action buttons do not rotate the camera.
- [ ] Releasing the movement pointer stops movement.
- [ ] `pointercancel` stops movement.
- [ ] Lost capture stops movement.
- [ ] Switching applications stops movement.
- [ ] Locking and unlocking the device does not restore stale movement.
- [ ] Orientation change neutralizes active input and restores correct bounds.

## Layout and browser behavior

- [ ] Controls respect all safe-area insets in portrait and landscape.
- [ ] Primary controls remain reachable one-handed in landscape.
- [ ] Interacting with the game surface does not scroll or zoom the page.
- [ ] Interacting outside the game surface leaves normal page scrolling and zooming available.
- [ ] Browser edge gestures do not make required controls unusable.

## Certification-world traversal

- [ ] Flat road
- [ ] Stairs
- [ ] Upward and downward ramps
- [ ] Narrow doorway
- [ ] Interior room corners
- [ ] Low ceiling
- [ ] Moving platform
- [ ] Water edge
- [ ] Uneven terrain
- [ ] Crowded props
- [ ] Enter and exit a basic vehicle
- [ ] Stable behavior at low, normal, and high frame rates

## Result

- Status: `PASS` / `FAIL` / `BLOCKED`
- Tester:
- Date:
- Device and browser:
- Commit:
- Failures and evidence:
