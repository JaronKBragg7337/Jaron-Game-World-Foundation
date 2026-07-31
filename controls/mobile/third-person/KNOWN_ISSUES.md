# Known Issues and Rejected Patterns

## Platform hazards

### Cancelled touches leave movement active

Some mobile browsers terminate a gesture through `pointercancel`, lost capture, orientation changes, application switching, or visibility changes rather than a normal pointer-up event.

**Required mitigation:** every termination path resets the owned control; a global neutral reset runs on blur and visibility loss.

### UI touches rotate the camera

A broad look handler attached to the complete canvas can accidentally process touches that began on joysticks or buttons.

**Rejected pattern:** determining ownership from the pointer's current position during movement.

**Required mitigation:** assign an immutable owner at pointer-down and ignore the pointer in all other systems.

### Vertical camera direction is inverted

Screen coordinates increase downward, while camera pitch conventions vary by engine.

**Required mitigation:** certify “drag upward looks upward” on every engine port. Do not assume the sign from another engine.

### Camera orbit is used as fake character turning

Orbiting the camera while leaving the authoritative character or vehicle orientation unchanged creates controls that appear to turn but do not alter actual motion.

**Rejected pattern:** treating camera orbit as a substitute for entity yaw.

### Browser gestures escape the game surface

Overly broad global `touch-action: none`, `preventDefault`, or viewport restrictions can damage the surrounding website.

**Required mitigation:** scope gesture suppression to the game surface and active control elements.

### Orientation changes preserve stale control bounds

Cached joystick/button rectangles become incorrect after rotation or safe-area changes.

**Required mitigation:** invalidate bounds, neutralize active pointers, and recalculate layout before new input.

## Approval blockers

The following automatically block approval:

- any left/right or up/down sign mismatch;
- movement continuing after input termination;
- camera movement caused by action-button touches;
- camera clipping through certification geometry;
- movement direction changing with camera pitch;
- safe-area overlap that obstructs a primary control;
- a fix that works only in desktop touch emulation.
