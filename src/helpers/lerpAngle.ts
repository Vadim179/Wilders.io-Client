export function lerpAngle(a: number, b: number, t: number) {
  const delta = ((b - a + 540) % 360) - 180;
  return a + delta * t;
}
