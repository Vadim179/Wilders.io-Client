import { SpriteRenderingOrder } from "../config/rendering.config";
import { Texture } from "../enums/textureEnum";

export interface SpriteConstructorParams {
  scene: Phaser.Scene;
  id: number;
  x: number;
  y: number;
  texture: Texture;
  zIndex: string;
}

export class Sprite extends Phaser.GameObjects.Sprite {
  id: number;

  constructor({ id, scene, x, y, texture, zIndex }: SpriteConstructorParams) {
    super(scene, x, y, texture);
    this.id = id;

    if (zIndex) {
      this.setDepth(SpriteRenderingOrder.indexOf(zIndex));
    }

    this.scene.add.existing(this);
  }
}
