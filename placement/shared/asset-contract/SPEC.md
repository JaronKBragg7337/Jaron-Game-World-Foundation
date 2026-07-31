# Asset Placement Contract

**Status:** EXPERIMENTAL  
**Version:** 0.1.0

Every reusable asset must declare enough metadata to be placed, oriented, scaled, grounded, snapped, and validated without visual guesswork.

## Required metadata

```json
{
  "units": "meters",
  "pivotLocation": "ground-contact-center",
  "forwardAxis": "+Z",
  "upAxis": "+Y",
  "groundContactPoints": [],
  "boundingBox": { "min": [0, 0, 0], "max": [0, 0, 0] },
  "recommendedScale": [1, 1, 1],
  "allowedScaleRange": { "min": 0.9, "max": 1.1 },
  "collisionType": "simple|compound|mesh|none",
  "snapPoints": [],
  "surfaceCompatibility": ["flat", "slope", "wall", "planetary"],
  "foundationRequiredAboveSlopeDegrees": 0
}
```

## Flat-world rules

1. Pivot is at the intended ground-contact center unless the asset documents another functional pivot.
2. Geometry may not extend below the intended floor plane unless explicitly identified as a buried/foundation component.
3. Doors align to the standard floor height and expose compatible snap points.
4. Walls declare thickness and use the project's approved snap increment.
5. Floors and walls share compatible grid and elevation increments.
6. Props visibly contact their supporting surface without sinking or hovering.
7. Collision bounds must represent the traversable visual silhouette closely enough to avoid invisible obstruction or visible penetration.

## Sloped-terrain rules

1. Grounding samples multiple declared contact points when asset footprint or height makes a single raycast unreliable.
2. Tall buildings do not directly align to local terrain normals.
3. Buildings use foundations, prepared pads, terrain flattening, or documented supports.
4. Small props may align to a local normal only within a declared maximum tilt.
5. Vehicles use wheel/contact suspension logic rather than generic prop alignment.
6. Placement fails visibly and diagnostically when a valid support solution cannot be found; it does not silently hover, sink, or lean.

## Snap-point rules

Each snap point declares:

- local position;
- local forward and up;
- semantic type;
- compatible semantic types;
- allowed rotation increments;
- maximum positional tolerance;
- occupancy state where applicable.

A snapped connection must preserve compatible surface normals, elevation, wall thickness, and intended facing.

## Scale rules

1. Source units and import units are explicit.
2. Runtime scale remains `[1,1,1]` for approved production assets unless documented otherwise.
3. Non-uniform runtime scaling is prohibited for structural, animated, physics, door, and snap-enabled assets unless specifically tested.
4. Human-scale references and doorway clearances are validated in the certification scene.

## Approval blockers

- unexplained geometry below ground;
- missing or misleading pivots;
- hovering or sinking at nominal placement;
- visual forward disagreeing with declared forward;
- invisible collision substantially larger than the visible asset;
- snap points that create gaps, overlap, leaning, or inconsistent elevation;
- undocumented unit conversion or corrective scale.
