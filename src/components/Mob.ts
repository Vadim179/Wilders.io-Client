import { MobTag } from "../enums/mobTagEnum";
import { Texture } from "../enums/textureEnum";
import { TextureRenderingOrderEnum } from "../enums/textureRenderingOrderEnum";
import { lerp } from "../helpers/lerp";
import { lerpAngle } from "../helpers/lerpAngle";
import { Sprite, SpriteConstructorParams } from "./Sprite";

const mobTagToTextureRenderingOrderMap = {
  [MobTag.Wolf]: TextureRenderingOrderEnum.Wolf,
  // [MobTag.Rabbit]: TextureRenderingOrderEnum.Rabbit,
};

const mobTagToTextureMap = {
  [MobTag.Wolf]: Texture.Wolf,
  // [MobTag.Rabbit]: Texture.Rabbit,
};

interface MobConstructorParams
  extends Omit<SpriteConstructorParams, "texture"> {
  targetX: number;
  targetY: number;
  health: number;
  mobTag: MobTag;
}

export class Mob extends Sprite {
  targetX: number;
  targetY: number;
  targetAngle: number;

  health: number;
  mobTag: MobTag;

  tween: Phaser.Tweens.Tween;

  constructor({
    targetX,
    targetY,
    health,
    mobTag,
    ...baseOptions
  }: MobConstructorParams) {
    super({
      ...baseOptions,
      order: mobTagToTextureRenderingOrderMap[mobTag],
      texture: mobTagToTextureMap[mobTag],
    });

    this.targetX = targetX;
    this.targetY = targetY;
    this.health = health;
    this.mobTag = mobTag;

    this.create();
  }

  create() {
    this.tween = this.scene.tweens.add({
      targets: this,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 800,
      ease: "Power1",
      yoyo: true,
      loop: -1,
    });
  }

  update() {
    const lerpFactor = 0.075;
    this.x = lerp(this.x, this.targetX, lerpFactor);
    this.y = lerp(this.y, this.targetY, lerpFactor);

    const targetAngle =
      Math.atan2(this.targetY - this.y, this.targetX - this.x) *
        (180 / Math.PI) -
      90;

    const angleLerpFactor = 0.25;
    this.angle = lerpAngle(this.angle, targetAngle, angleLerpFactor);
  }
}
