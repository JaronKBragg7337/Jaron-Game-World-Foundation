# Control Certification Playground

This scene is intentionally plain. Its purpose is to expose behavioral defects, not to demonstrate art direction.

## Required fixtures

- flat ground and marked road
- stairs with multiple riser heights
- ascending and descending ramps
- narrow doorway and interior rooms
- low ceiling corridor
- moving platform
- water edge or fall boundary
- convex and concave wall corners
- uneven terrain
- densely placed props
- basic enterable vehicle
- frame-rate controls or deterministic throttling

## Required instrumentation

Display or log:

- active pointer IDs and owners;
- normalized movement vector and magnitude;
- camera yaw and pitch;
- character/vehicle forward vector;
- grounded state and contact normal;
- current frame rate and fixed-step rate;
- camera collision distance;
- current certification test identifier.

## Certification principle

A system is tested here before it is integrated into a real game. Failures discovered in production must be reproduced here before the shared module is changed.

## Initial implementation target

Build the first version as a Vite + TypeScript + Three.js application that can be deployed as a static site and exercised on physical mobile browsers. Engine-specific Unity and Unreal scenes should follow after the behavioral contract stabilizes.
