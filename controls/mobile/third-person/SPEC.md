# Third-Person Mobile Controls Specification

## Defaults

These are versioned defaults, not universal constants. Changes require a new module version and updated tests.

| Setting | Default |
|---|---:|
| Movement dead zone | 0.12 normalized radius |
| Walk-to-run threshold | 0.72 normalized radius |
| Camera minimum pitch | -55 degrees |
| Camera maximum pitch | +70 degrees |
| Camera yaw | unbounded and normalized internally |
| Joystick visual radius | 56 CSS px |
| Joystick maximum displacement | 48 CSS px |
| Look sensitivity | platform-calibrated; stored explicitly by implementation |

## Movement

1. The left virtual stick owns one pointer from pointer-down until pointer-up, pointer-cancel, lost capture, visibility loss, or forced reset.
2. Movement is relative to the camera's horizontal facing direction.
3. Pushing the stick upward moves the character toward the camera aim direction projected onto the movement plane.
4. Pushing left moves the character screen-left. Pushing right moves screen-right.
5. Camera pitch must not tilt the movement plane. The forward vector is projected onto the world-up plane before movement is calculated.
6. Input inside the dead zone produces zero movement.
7. Magnitude outside the dead zone is remapped smoothly to the range 0–1.
8. Magnitude at or above the run threshold requests running where running is supported.
9. The character rotates toward the resulting movement direction unless a consuming game explicitly declares an approved strafe/lock-on mode.
10. Movement continues without discontinuity while another pointer controls the camera.
11. Frame-rate changes must not reverse, multiply, or suppress input direction.

## Camera

1. A drag beginning on the designated look surface owns one pointer for camera movement.
2. Dragging right increases camera yaw to rotate the view right.
3. Dragging left rotates the view left.
4. Dragging upward looks upward.
5. Dragging downward looks downward.
6. Pitch is clamped to the declared minimum and maximum values.
7. The camera must never flip or cross its poles.
8. Camera collision prevents the camera from passing through walls, ceilings, props, or terrain between its target and desired position.
9. Collision recovery must be smooth enough to avoid a one-frame jump through geometry.
10. Automatic recentering is disabled by default and may only be enabled as an explicit module option.
11. A touch beginning on a joystick, action button, menu, or other interactive UI element may not rotate the camera.

## Input ownership

1. Each active pointer has exactly one owner: movement, look, action UI, or unclaimed.
2. Ownership is assigned at pointer-down and does not migrate because the pointer crosses another region.
3. The movement and look pointers may operate simultaneously.
4. Action-button pointers may operate simultaneously with movement and look unless the action itself intentionally blocks them.
5. A released, cancelled, lost, or invalid pointer immediately returns its owned control to neutral.
6. Window blur, document visibility loss, orientation change, and game-surface teardown trigger a global neutral reset.
7. Pointer capture is used where available, with equivalent fallback behavior where it is not.

## Mobile UI

1. Controls account for CSS safe-area inset variables on devices with notches, rounded corners, or home indicators.
2. Primary movement and action controls remain reachable in landscape orientation without requiring the hand to cross the center of the screen.
3. Controls do not overlap browser-reserved edge gestures more than necessary.
4. The game surface disables browser panning, selection, and pinch behavior only within its own interaction boundary.
5. The surrounding page remains scrollable and zoomable when interaction does not begin on the game surface.
6. Orientation changes recompute control bounds before accepting new pointer input.
7. UI scale changes preserve the normalized behavior of dead zones and movement magnitude.

## Camera-relative basis

Given world up `U`, camera forward `F`, and a two-dimensional stick vector `(x, y)`:

1. `forward = normalize(F - dot(F, U) * U)`
2. `right = normalize(cross(U, forward))`
3. `desired = normalize(forward * y + right * x)` when magnitude is nonzero

An engine port may change the cross-product order to match its handedness, but the screen-direction tests must remain identical.

## Out of scope for version 0.1.0

- lock-on combat movement;
- shoulder swapping;
- gyro aiming;
- tap-to-move;
- dynamic joystick relocation;
- accessibility alternatives beyond configurable size and sensitivity.
