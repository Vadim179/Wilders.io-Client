export const PhaserGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  autoFocus: true,
  disableContextMenu: true,
  backgroundColor: "#9ab855",
  fps: {
    min: 30,
    target: 120,
    smoothStep: true,
  },
  render: {
    roundPixels: true,
    antialias: true,
    antialiasGL: true,
    powerPreference: "high-performance",
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}
