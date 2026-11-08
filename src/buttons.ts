// The standard mapping (w3c.github.io/gamepad/#remapping), which Steam Input's virtual pad and an Xbox-style pad report.
const Button = {
  a: 0,
  b: 1,
  x: 2,
  y: 3,
  lb: 4,
  rb: 5,
  lt: 6,
  rt: 7,
  back: 8,
  start: 9,
  ls: 10,
  rs: 11,
  up: 12,
  down: 13,
  left: 14,
  right: 15,
  home: 16,
} as const

export { Button }
