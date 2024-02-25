import { texturesWithShadows } from "../config/map";
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
  shadow: Phaser.GameObjects.Sprite;
  spriteTexture: Texture;

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
    this.spriteTexture = texture;
    this.setDepth(order);
    this.scene.add.existing(this);
    this.create();
  }

  create() {
    const hasShadow = texturesWithShadows.includes(this.spriteTexture);

    if (hasShadow) {
      this.shadow = this.scene.add.sprite(this.x + 15, this.y + 15, this.texture);
      this.shadow.blendMode = Phaser.BlendModes.ERASE;
      this.shadow.setAlpha(0.5);
      this.shadow.setDepth(TextureRenderingOrderEnum.Shadow);
    }
  }
}
