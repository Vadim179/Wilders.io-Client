import { TextureRenderingOrderEnum } from "../enums/textureRenderingOrderEnum";

export class MiniMap {
  private scene: Phaser.Scene;
  private miniMapGraphics: Phaser.GameObjects.Graphics;
  private miniMapWidth: number;
  private miniMapHeight: number;

  constructor(scene: Phaser.Scene, canvasWidth: number, canvasHeight: number) {
    this.scene = scene;

    // Set mini-map dimensions
    this.miniMapWidth = 200;
    this.miniMapHeight = 200;

    // Create mini-map graphics
    this.miniMapGraphics = this.scene.add
      .graphics()
      .setScrollFactor(0)
      .setDepth(TextureRenderingOrderEnum.UI);

    // Position mini-map at the bottom right corner of the window
    const miniMapX = canvasWidth - this.miniMapWidth - 20;
    const miniMapY = canvasHeight - this.miniMapHeight - 20;

    this.miniMapGraphics.x = miniMapX;
    this.miniMapGraphics.y = miniMapY;

    this.miniMapGraphics.fillStyle(0x000000, 1);
    this.miniMapGraphics.fillRect(0, 0, this.miniMapWidth, this.miniMapHeight);
    this.miniMapGraphics.setAlpha(0.5);
    this.create();

    this.scene.events.on("positionChanged", this.updateMiniMap, this);
  }

  create() {
    this.miniMapGraphics.fillStyle(0x000000, 1);
    this.miniMapGraphics.fillRect(0, 0, this.miniMapWidth, this.miniMapHeight);
    this.miniMapGraphics.setAlpha(0.5);
  }

  updateMiniMap(playerPosition: { x: number; y: number }) {
    const { x, y } = playerPosition;

    const canvasWidth = this.scene.cameras.main.width;
    const canvasHeight = this.scene.cameras.main.height;

    // Calculate player's position relative to the canvas
    let canvasPlayerX = (x / canvasWidth) * this.miniMapWidth;
    let canvasPlayerY = (y / canvasHeight) * this.miniMapHeight;

    // Clamp player's position within the bounds of the mini-map
    canvasPlayerX = Phaser.Math.Clamp(canvasPlayerX, 0, this.miniMapWidth);
    canvasPlayerY = Phaser.Math.Clamp(canvasPlayerY, 0, this.miniMapHeight);

    // Clear the mini-map and draw the player marker
    this.miniMapGraphics.clear();
    this.miniMapGraphics.fillStyle(0x000000, 1);
    this.miniMapGraphics.fillRect(0, 0, this.miniMapWidth, this.miniMapHeight);
    this.miniMapGraphics.fillStyle(0xff0000, 1);
    this.miniMapGraphics.fillEllipse(canvasPlayerX, canvasPlayerY, 10, 10);
  }
}
