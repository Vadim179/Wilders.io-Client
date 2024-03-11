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
  tween: Phaser.Tweens.Tween;

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
  }

  attack(angleInRadians) {
    this.tween = this.scene.tweens.add({
      targets: this,
      x: this.x + Math.cos(angleInRadians) * 5,
      y: this.y + Math.sin(angleInRadians) * 5,
      duration: 100,
      yoyo: true,
      ease: "Power1"
    });

    this.tween.on("complete", () => {
      this.tween.remove();
      this.tween = null;
    });
  }
}
