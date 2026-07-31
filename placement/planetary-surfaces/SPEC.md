# Planetary Surface Placement

**Status:** EXPERIMENTAL  
**Version:** 0.1.0

## Coordinate frame

For planet center `C` and object surface position `P`:

1. `up = normalize(P - C)`
2. Project the desired world/reference forward vector onto the tangent plane:
   `forward = normalize(referenceForward - dot(referenceForward, up) * up)`
3. `right = normalize(cross(up, forward))`, adjusted for engine handedness while preserving screen-direction tests.
4. Build the object's orientation from the orthonormal tangent frame `(right, up, forward)`.

## Requirements

- Gravity points toward the planet center.
- Local up is radial, never a fixed global axis.
- Forward remains tangent to the surface.
- Small props may use sampled surface normals within declared tilt limits.
- Large structures use a local tangent construction frame, foundation system, or terrain-conforming design.
- A single normal sample may not determine the orientation of a large footprint.
- Roads and modular structures preserve local elevation and connection continuity across cells.
- Long-distance worlds must define a precision strategy: floating origin, origin rebasing, local coordinate cells, or engine-native equivalent.
- Physics, rendering, input, and camera systems must share the same current local frame after an origin shift.

## Failure cases

- structures leaning toward local terrain noise;
- forward vectors collapsing near alignment with radial up;
- gravity and character up disagreeing;
- snap points using global rather than local tangent orientation;
- visible jitter from large coordinates;
- physics objects jumping during origin rebasing;
- roads twisting because adjacent tangent frames are not transported consistently.

## Approval gate

Certification must include equatorial, polar, and intermediate-latitude placement; traversal across cell/origin boundaries; small props; tall structures; roads; vehicles; camera behavior; and physics objects.
