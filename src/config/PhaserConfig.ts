export const PhaserGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  disableContextMenu: true,
  backgroundColor: "#9ab855",
  render: {
    antialias: true,
    roundPixels: true,
    antialiasGL: true,
    transparent: true,
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}
