export function encodeMovement(x, y) {
  x = Math.max(0, Math.min(2, x));
  y = Math.max(0, Math.min(2, y));
  return (y << 2) | x;
}
