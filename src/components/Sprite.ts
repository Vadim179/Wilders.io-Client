import { Texture } from "../enums/textureEnum";
import { TextureRenderingOrderEnum } from "../enums/textureRenderingOrderEnum";

export interface SpriteConstructorParams {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: Texture;
  id?: string;
  order?: number;
}

export class Sprite extends Phaser.GameObjects.Sprite {
  id: string;

  constructor({
    scene,
    x,
    y,
    texture,
    id = "",
    order = TextureRenderingOrderEnum.Default
  }: SpriteConstructorParams) {
    super(scene, x, y, texture);
    this.id = id;
    this.setDepth(order);
    this.scene.add.existing(this);
  }
}
