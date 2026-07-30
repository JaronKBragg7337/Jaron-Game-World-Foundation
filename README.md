# Jaron Game World Foundation

A personal implementation standard library for games and interactive worlds.

The purpose of this repository is to stop future projects from rediscovering the same answers. Controls, cameras, vehicles, placement, world assembly, validation, and engine-specific ports are treated as reusable, testable standards rather than one-off implementations.

## Core rule

Approved systems are integrated, not redesigned.

Every standard module should contain:

1. A reference implementation
2. A playable test scene
3. An exact behavioral specification
4. Known failure cases
5. Integration instructions
6. A verification checklist

## Repository areas

- `controls/` — mobile, keyboard/mouse, controller, rebinding, sensitivity, and accessibility
- `camera/` — first-person, third-person, orbit, vehicle, interior, and collision avoidance
- `vehicles/` — cars, trucks, motorcycles, boats, aircraft, and spacecraft
- `placement/` — flat worlds, terrain, slopes, modular surfaces, planets, and floating origins
- `world-assembly/` — roads, sidewalks, curbs, buildings, doors, interiors, props, and vegetation
- `validation/` — scale, contact, collision, orientation, safe-area, and performance checks
- `examples/` — certification playgrounds and integration examples
- `docs/` — shared behavior, contracts, engine notes, and known issues

## Module lifecycle

Each module is one of:

- `APPROVED` — verified and preferred for integration
- `EXPERIMENTAL` — usable for testing, but not a default standard
- `DEPRECATED` — preserved to prevent old failures from being recreated

The machine-readable source of truth is [`registry.json`](./registry.json).

## Initial milestone

The first implementation target is a deliberately plain control-certification world containing:

- flat ground and road
- stairs and ramps
- narrow doors and interior rooms
- a low ceiling
- moving platforms
- water edges
- wall corners
- uneven terrain
- crowded props
- a basic vehicle

A control system is not approved until it passes this environment across its declared platforms.

## Design principle

This repository preserves decisions, not merely code: movement feel, camera direction, pitch limits, safe-area behavior, axis conventions, asset pivots, ground contact, snapping rules, and unacceptable visual failures.
