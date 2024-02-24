export const phaserGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  canvas: document.querySelector("canvas") as HTMLCanvasElement,
  autoFocus: true,
  disableContextMenu: true,
  backgroundColor: "#9ab855",
  fps: {
    min: 60,
    target: 120,
    smoothStep: true
  },
  render: {
    roundPixels: true,
    antialias: true,
    antialiasGL: true,
    powerPreference: "high-performance"
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
