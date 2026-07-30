# Vehicle Axis Convention

**Status:** EXPERIMENTAL  
**Version:** 0.1.0

## Canonical convention

- World up: `+Y`
- Vehicle root forward: `+Z`
- Vehicle root right: `+X`
- Visual mesh nose: `+Z`
- Steering yaw axis: `+Y`
- Wheel axle / rolling axis: local `+X`
- Positive throttle: movement toward root `+Z`
- Reverse: movement toward root `-Z`

Engine import transforms may differ internally, but the normalized vehicle root exposed to gameplay code must follow this convention.

## Requirements

1. The authoritative physics/body transform and the visible mesh must agree on forward direction.
2. Camera-follow code derives its behind position from the normalized vehicle forward vector, not from an assumed engine axis.
3. Positive steering input turns the vehicle toward the same screen direction shown by the steering control.
4. Wheel steering pivots around local up; wheel rolling occurs around the axle.
5. Import correction belongs in a documented mesh child transform. Gameplay code must not accumulate unexplained quarter-turn fixes.
6. Entering or exiting a vehicle may not modify its canonical root-axis contract.
7. Every vehicle package records model-forward, normalized-root-forward, wheel axes, and any import correction.

## Required metadata

```json
{
  "rootForwardAxis": "+Z",
  "rootUpAxis": "+Y",
  "visualMeshNoseAxis": "+Z",
  "wheelAxleAxis": "+X",
  "steeringAxis": "+Y",
  "importCorrectionEulerDegrees": [0, 0, 0]
}
```

## Approval blockers

- The mesh visually faces one direction while positive throttle moves another.
- Steering input and visual turning disagree.
- A chase camera follows an assumed axis rather than actual vehicle forward.
- Wheel rotation or steering axes are undocumented.
- Engine-specific corrective rotations are scattered through gameplay code.
