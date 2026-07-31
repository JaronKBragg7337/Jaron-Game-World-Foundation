import * as THREE from 'three';
import './style.css';

const canvas = document.querySelector<HTMLCanvasElement>('#game');
const shell = document.querySelector<HTMLElement>('#game-shell');
const joystick = document.querySelector<HTMLElement>('#joystick');
const knob = document.querySelector<HTMLElement>('#joystick-knob');
const resetButton = document.querySelector<HTMLButtonElement>('#action');
const telemetry = document.querySelector<HTMLElement>('#telemetry');

if (!canvas || !shell || !joystick || !knob || !resetButton || !telemetry) {
  throw new Error('Playground UI failed to initialize.');
}

type PointerOwner = 'move' | 'look' | 'action';

const CONFIG = {
  deadZone: 0.12,
  runThreshold: 0.72,
  walkSpeed: 4.2,
  runSpeed: 7.4,
  turnSpeed: 12,
  lookSensitivity: 0.0042,
  minPitch: THREE.MathUtils.degToRad(-55),
  maxPitch: THREE.MathUtils.degToRad(70),
  cameraDistance: 6.2,
  cameraHeight: 1.45,
  joystickRadius: 48,
};

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8fb4d8);
scene.fog = new THREE.Fog(0x8fb4d8, 30, 92);

const camera = new THREE.PerspectiveCamera(58, 1, 0.05, 160);
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const cameraObstacles: THREE.Object3D[] = [];
const pointerOwners = new Map<number, PointerOwner>();
const keys = new Set<string>();

let movePointer: number | null = null;
let lookPointer: number | null = null;
let lookLast = new THREE.Vector2();
let stick = new THREE.Vector2();
let yaw = 0;
let pitch = THREE.MathUtils.degToRad(18);
let grounded = true;
let cameraCollisionDistance = CONFIG.cameraDistance;
let fps = 60;
let fpsAccumulator = 0;
let fpsFrames = 0;

const hemi = new THREE.HemisphereLight(0xd9edff, 0x536148, 2.1);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(14, 22, -8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -35;
sun.shadow.camera.right = 35;
sun.shadow.camera.top = 35;
sun.shadow.camera.bottom = -35;
scene.add(sun);

const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x556b4f, roughness: 0.92 });
const concreteMaterial = new THREE.MeshStandardMaterial({ color: 0x777d87, roughness: 0.88 });
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xb7afa2, roughness: 0.9 });
const accentMaterial = new THREE.MeshStandardMaterial({ color: 0xc46d3c, roughness: 0.72 });
const waterMaterial = new THREE.MeshStandardMaterial({ color: 0x287da6, roughness: 0.24, metalness: 0.08 });

function addBox(
  size: THREE.Vector3,
  position: THREE.Vector3,
  material: THREE.Material,
  obstacle = true,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), material);
  mesh.position.copy(position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  if (obstacle) cameraObstacles.push(mesh);
  return mesh;
}

const ground = addBox(new THREE.Vector3(80, 0.5, 80), new THREE.Vector3(0, -0.25, 0), groundMaterial, false);
ground.receiveShadow = true;

// Main road and lane markings.
addBox(new THREE.Vector3(12, 0.08, 64), new THREE.Vector3(0, 0.04, 0), concreteMaterial, false);
for (let z = -27; z <= 27; z += 6) {
  addBox(new THREE.Vector3(0.22, 0.03, 2.8), new THREE.Vector3(0, 0.1, z), accentMaterial, false);
}

// Stairs.
for (let i = 0; i < 6; i += 1) {
  addBox(
    new THREE.Vector3(5, 0.35, 1.2),
    new THREE.Vector3(-10, 0.175 + i * 0.35, -15 + i * 1.05),
    concreteMaterial,
  );
}

// Ramp and elevated deck.
const ramp = addBox(new THREE.Vector3(5, 0.35, 10), new THREE.Vector3(10, 1.25, -13), concreteMaterial);
ramp.rotation.x = THREE.MathUtils.degToRad(-14);
addBox(new THREE.Vector3(7, 0.5, 7), new THREE.Vector3(10, 2.3, -5.5), concreteMaterial);

// Narrow doorway and interior room.
addBox(new THREE.Vector3(0.5, 4, 10), new THREE.Vector3(-16, 2, 7), wallMaterial);
addBox(new THREE.Vector3(8, 4, 0.5), new THREE.Vector3(-12, 2, 12), wallMaterial);
addBox(new THREE.Vector3(3.1, 4, 0.5), new THREE.Vector3(-14.45, 2, 2), wallMaterial);
addBox(new THREE.Vector3(3.1, 4, 0.5), new THREE.Vector3(-9.55, 2, 2), wallMaterial);
addBox(new THREE.Vector3(1.8, 1.1, 0.5), new THREE.Vector3(-12, 3.45, 2), wallMaterial);
addBox(new THREE.Vector3(7.5, 0.35, 9.5), new THREE.Vector3(-12.25, 4.1, 7), wallMaterial);

// Wall corners and crowded props.
addBox(new THREE.Vector3(0.5, 3.2, 8), new THREE.Vector3(16, 1.6, 8), wallMaterial);
addBox(new THREE.Vector3(7, 3.2, 0.5), new THREE.Vector3(12.75, 1.6, 11.75), wallMaterial);
for (let i = 0; i < 14; i += 1) {
  const x = 8 + (i % 4) * 1.55;
  const z = 5 + Math.floor(i / 4) * 1.55;
  addBox(new THREE.Vector3(0.8, 0.8 + (i % 3) * 0.45, 0.8), new THREE.Vector3(x, 0.4, z), accentMaterial);
}

// Water / fall edge.
addBox(new THREE.Vector3(17, 0.16, 11), new THREE.Vector3(-19, 0.02, -22), waterMaterial, false);
addBox(new THREE.Vector3(18, 0.5, 1), new THREE.Vector3(-19, 0.25, -16.5), concreteMaterial);

// Moving platform.
const movingPlatform = addBox(new THREE.Vector3(4.5, 0.5, 4.5), new THREE.Vector3(19, 1.2, -18), accentMaterial);

// Uneven terrain represented by stepped test pads.
for (let x = -2; x <= 2; x += 1) {
  for (let z = -2; z <= 2; z += 1) {
    const height = 0.15 + ((x * x + z * z + x - z + 12) % 5) * 0.18;
    addBox(
      new THREE.Vector3(2, height, 2),
      new THREE.Vector3(20 + x * 2, height / 2, 20 + z * 2),
      groundMaterial,
      false,
    );
  }
}

// Basic vehicle fixture, intentionally static in v0.1.
const vehicle = new THREE.Group();
const vehicleBody = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.8, 5.2), accentMaterial);
vehicleBody.position.y = 1;
vehicleBody.castShadow = true;
vehicle.add(vehicleBody);
const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.9, 2.3), wallMaterial);
cabin.position.set(0, 1.75, -0.4);
cabin.castShadow = true;
vehicle.add(cabin);
for (const x of [-1.45, 1.45]) {
  for (const z of [-1.6, 1.6]) {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.34, 18),
      new THREE.MeshStandardMaterial({ color: 0x17191d, roughness: 0.9 }),
    );
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.62, z);
    wheel.castShadow = true;
    vehicle.add(wheel);
  }
}
vehicle.position.set(-5, 0, 22);
scene.add(vehicle);
cameraObstacles.push(vehicleBody, cabin);

// Player capsule surrogate with an obvious +Z nose marker.
const player = new THREE.Group();
const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.48, 1.05, 6, 12),
  new THREE.MeshStandardMaterial({ color: 0x233e78, roughness: 0.65 }),
);
body.position.y = 1;
body.castShadow = true;
player.add(body);
const nose = new THREE.Mesh(
  new THREE.ConeGeometry(0.18, 0.65, 10),
  new THREE.MeshStandardMaterial({ color: 0xffd34d, roughness: 0.55 }),
);
nose.rotation.x = Math.PI / 2;
nose.position.set(0, 1.15, 0.8);
nose.castShadow = true;
player.add(nose);
scene.add(player);

const spawn = new THREE.Vector3(0, 0, 18);
player.position.copy(spawn);

function resetPlayer(): void {
  player.position.copy(spawn);
  player.rotation.set(0, 0, 0);
  yaw = 0;
  pitch = THREE.MathUtils.degToRad(18);
  neutralizeInput();
}

function neutralizeInput(): void {
  pointerOwners.clear();
  movePointer = null;
  lookPointer = null;
  stick.set(0, 0);
  knob.style.transform = 'translate(-50%, -50%)';
  keys.clear();
}

function joystickCenter(): THREE.Vector2 {
  const rect = joystick.getBoundingClientRect();
  return new THREE.Vector2(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

function updateStick(clientX: number, clientY: number): void {
  const center = joystickCenter();
  const delta = new THREE.Vector2(clientX - center.x, clientY - center.y);
  const length = delta.length();
  if (length > CONFIG.joystickRadius) delta.multiplyScalar(CONFIG.joystickRadius / length);
  stick.set(delta.x / CONFIG.joystickRadius, -delta.y / CONFIG.joystickRadius);
  knob.style.transform = `translate(calc(-50% + ${delta.x}px), calc(-50% + ${delta.y}px))`;
}

function pointerOwnerForTarget(target: EventTarget | null): PointerOwner {
  if (target instanceof Node && resetButton.contains(target)) return 'action';
  if (target instanceof Node && joystick.contains(target)) return 'move';
  return 'look';
}

shell.addEventListener('pointerdown', (event) => {
  const owner = pointerOwnerForTarget(event.target);
  if ((owner === 'move' && movePointer !== null) || (owner === 'look' && lookPointer !== null)) return;

  pointerOwners.set(event.pointerId, owner);
  shell.setPointerCapture?.(event.pointerId);

  if (owner === 'move') {
    movePointer = event.pointerId;
    updateStick(event.clientX, event.clientY);
  } else if (owner === 'look') {
    lookPointer = event.pointerId;
    lookLast.set(event.clientX, event.clientY);
  }
}, { passive: false });

shell.addEventListener('pointermove', (event) => {
  const owner = pointerOwners.get(event.pointerId);
  if (!owner) return;
  event.preventDefault();

  if (owner === 'move' && movePointer === event.pointerId) {
    updateStick(event.clientX, event.clientY);
  } else if (owner === 'look' && lookPointer === event.pointerId) {
    const dx = event.clientX - lookLast.x;
    const dy = event.clientY - lookLast.y;
    yaw -= dx * CONFIG.lookSensitivity;
    pitch = THREE.MathUtils.clamp(pitch + dy * CONFIG.lookSensitivity, CONFIG.minPitch, CONFIG.maxPitch);
    lookLast.set(event.clientX, event.clientY);
  }
}, { passive: false });

function releasePointer(event: PointerEvent): void {
  const owner = pointerOwners.get(event.pointerId);
  pointerOwners.delete(event.pointerId);
  if (owner === 'move' && movePointer === event.pointerId) {
    movePointer = null;
    stick.set(0, 0);
    knob.style.transform = 'translate(-50%, -50%)';
  }
  if (owner === 'look' && lookPointer === event.pointerId) lookPointer = null;
}

shell.addEventListener('pointerup', releasePointer);
shell.addEventListener('pointercancel', releasePointer);
shell.addEventListener('lostpointercapture', releasePointer);
resetButton.addEventListener('click', resetPlayer);
window.addEventListener('blur', neutralizeInput);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) neutralizeInput();
});
window.addEventListener('orientationchange', neutralizeInput);
window.addEventListener('keydown', (event) => {
  keys.add(event.code);
  if (event.code === 'KeyR') resetPlayer();
});
window.addEventListener('keyup', (event) => keys.delete(event.code));

function keyboardStick(): THREE.Vector2 {
  const x = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
  const y = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown'));
  return new THREE.Vector2(x, y).clampLength(0, 1);
}

function remapMagnitude(raw: number): number {
  if (raw <= CONFIG.deadZone) return 0;
  return THREE.MathUtils.clamp((raw - CONFIG.deadZone) / (1 - CONFIG.deadZone), 0, 1);
}

const movement = new THREE.Vector3();
const cameraForward = new THREE.Vector3();
const cameraRight = new THREE.Vector3();
const desiredCamera = new THREE.Vector3();
const cameraTarget = new THREE.Vector3();
const cameraDirection = new THREE.Vector3();
const worldUp = new THREE.Vector3(0, 1, 0);

function updatePlayer(delta: number): { magnitude: number; running: boolean } {
  const keyboard = keyboardStick();
  const input = keyboard.lengthSq() > 0 ? keyboard : stick;
  const rawMagnitude = Math.min(input.length(), 1);
  const magnitude = remapMagnitude(rawMagnitude);
  const running = keys.has('ShiftLeft') || keys.has('ShiftRight') || rawMagnitude >= CONFIG.runThreshold;

  if (magnitude > 0) {
    camera.getWorldDirection(cameraForward);
    cameraForward.y = 0;
    if (cameraForward.lengthSq() < 0.0001) cameraForward.set(0, 0, 1);
    cameraForward.normalize();
    cameraRight.crossVectors(worldUp, cameraForward).normalize();

    movement
      .copy(cameraForward)
      .multiplyScalar(input.y)
      .addScaledVector(cameraRight, input.x)
      .normalize();

    const speed = running ? CONFIG.runSpeed : CONFIG.walkSpeed;
    player.position.addScaledVector(movement, speed * magnitude * delta);
    player.position.x = THREE.MathUtils.clamp(player.position.x, -37, 37);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -37, 37);

    const targetYaw = Math.atan2(movement.x, movement.z);
    const currentYaw = player.rotation.y;
    const angularDelta = Math.atan2(Math.sin(targetYaw - currentYaw), Math.cos(targetYaw - currentYaw));
    player.rotation.y += angularDelta * Math.min(1, CONFIG.turnSpeed * delta);
  }

  player.position.y = 0;
  grounded = true;
  return { magnitude, running };
}

function updateCamera(delta: number): void {
  cameraTarget.copy(player.position).add(new THREE.Vector3(0, CONFIG.cameraHeight, 0));
  const orbit = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    Math.cos(yaw) * Math.cos(pitch),
  );
  desiredCamera.copy(cameraTarget).addScaledVector(orbit, -CONFIG.cameraDistance);

  cameraDirection.copy(desiredCamera).sub(cameraTarget);
  const desiredDistance = cameraDirection.length();
  cameraDirection.normalize();
  raycaster.set(cameraTarget, cameraDirection);
  raycaster.far = desiredDistance;
  const hit = raycaster.intersectObjects(cameraObstacles, true)[0];
  const safeDistance = hit ? Math.max(0.65, hit.distance - 0.24) : desiredDistance;
  cameraCollisionDistance = THREE.MathUtils.damp(cameraCollisionDistance, safeDistance, hit ? 24 : 8, delta);

  desiredCamera.copy(cameraTarget).addScaledVector(cameraDirection, cameraCollisionDistance);
  camera.position.lerp(desiredCamera, 1 - Math.exp(-18 * delta));
  camera.lookAt(cameraTarget);
}

function resize(): void {
  const width = shell.clientWidth;
  const height = shell.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
}

const resizeObserver = new ResizeObserver(() => {
  neutralizeInput();
  resize();
});
resizeObserver.observe(shell);
resize();

function animate(): void {
  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;
  movingPlatform.position.y = 1.2 + Math.sin(elapsed * 1.35) * 0.9;

  const inputState = updatePlayer(delta);
  updateCamera(delta);

  fpsAccumulator += delta;
  fpsFrames += 1;
  if (fpsAccumulator >= 0.35) {
    fps = Math.round(fpsFrames / fpsAccumulator);
    fpsAccumulator = 0;
    fpsFrames = 0;
  }

  const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(player.quaternion);
  telemetry.textContent = [
    `pointer move: ${movePointer ?? 'none'}`,
    `pointer look: ${lookPointer ?? 'none'}`,
    `stick: ${stick.x.toFixed(2)}, ${stick.y.toFixed(2)}`,
    `magnitude: ${inputState.magnitude.toFixed(2)}`,
    `running: ${inputState.running}`,
    `yaw: ${THREE.MathUtils.radToDeg(yaw).toFixed(1)}°`,
    `pitch: ${THREE.MathUtils.radToDeg(pitch).toFixed(1)}°`,
    `forward: ${forward.x.toFixed(2)}, ${forward.z.toFixed(2)}`,
    `grounded: ${grounded}`,
    `camera: ${cameraCollisionDistance.toFixed(2)}m`,
    `fps: ${fps}`,
  ].join('\n');

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

resetPlayer();
updateCamera(1 / 60);
animate();
