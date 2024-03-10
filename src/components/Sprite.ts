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
    this.create();
  }

  create() {
    const hasShadow = texturesWithShadows.includes(this.spriteTexture);

    if (hasShadow) {
      this.shadow = this.scene.add.sprite(this.x + 15, this.y + 15, this.texture);
      this.shadow.blendMode = Phaser.BlendModes.ERASE;
      this.shadow.setAlpha(0.25);
      this.shadow.setDepth(TextureRenderingOrderEnum.Shadow);
    }
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
      console.log("got here");
      this.tween.remove();
      this.tween = null;
    });
  }
}
