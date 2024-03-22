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

export const mobInitialHealthMap = {
  [MobTag.Wolf]: 50,
  // [MobTag.Rabbit]: 10,
};

interface MobConstructorParams
  extends Omit<SpriteConstructorParams, "texture"> {
  targetX: number;
  targetY: number;
  health: number;
  mobTag: MobTag;
}

export class Mob extends Phaser.GameObjects.Container {
  targetX: number;
  targetY: number;
  targetAngle = 0;

  health: number;
  mobTag: MobTag;

  tween: Phaser.Tweens.Tween;
  pulseTween: Phaser.Tweens.Tween | null = null;

  pulseOverlaySprite: Sprite;
  bodySprite: Sprite;

  healthBar: MobHealthBar;
  healthBarOffset = { x: 0, y: 80 };

  constructor({
    targetX,
    targetY,
    health,
    mobTag,
    ...baseOptions
  }: MobConstructorParams) {
    super(baseOptions.scene, baseOptions.x, baseOptions.y, []);

    this.targetX = targetX;
    this.targetY = targetY;
    this.health = health;
    this.mobTag = mobTag;

    this.create();
    this.setDepth(mobTagToTextureRenderingOrderMap[this.mobTag]);
    baseOptions.scene.add.existing(this);
  }

  create() {
    this.tween = this.scene.tweens.add({
      targets: this,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 800,
      ease: "Power1",
      yoyo: true,
      loop: -1,
    });

    this.bodySprite = new Sprite({
      scene: this.scene,
      x: 0,
      y: 0,
      texture: mobTagToTextureMap[this.mobTag],
    });

    this.pulseOverlaySprite = new Sprite({
      scene: this.scene,
      x: 0,
      y: 0,
      texture: this.bodySprite.spriteTexture,
    })
      .setTint(0xff0000)
      .setAlpha(0)
      .setBlendMode(Phaser.BlendModes.LUMINOSITY);

    this.add([this.bodySprite, this.pulseOverlaySprite]);
    this.healthBar = new MobHealthBar(this.scene, this);
  }

  updateHealth(health: number) {
    if (health < this.health) {
      if (this.pulseTween === null) {
        this.pulseTween = this.scene.tweens.add({
          targets: this.pulseOverlaySprite,
          duration: 150,
          alpha: 0.5,
          yoyo: true,
          ease: "Linear",
          onComplete: () => {
            this.pulseTween.remove();
            this.pulseTween = null;
          },
        });
      }
    }

    this.health = health;
  }

  update() {
    const lerpFactor = 0.1;
    this.x = lerp(this.x, this.targetX, lerpFactor);
    this.y = lerp(this.y, this.targetY, lerpFactor);

    const angleLerpFactor = 0.1;
    this.angle = lerpAngle(this.angle, this.targetAngle, angleLerpFactor);

    this.healthBar.update();
  }
}

class MobHealthBar extends Phaser.GameObjects.Container {
  barContainer: Phaser.GameObjects.Graphics;
  bar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, private mob: Mob) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.create();
    this.setDepth(TextureRenderingOrderEnum.MobHealthBar);
  }

  create() {
    const { scene } = this;

    this.barContainer = scene.add
      .graphics()
      .fillStyle(0x000000, 0.75)
      .fillRoundedRect(0, 0, 60, 15, 7.5);

    this.bar = scene.add
      .graphics()
      .fillStyle(0x00ff00, 1)
      .fillRoundedRect(5, 5, 50, 5, 2.5);

    this.add([this.barContainer, this.bar]);
  }

  update() {
    const { mob } = this;

    this.x = mob.x + mob.healthBarOffset.x - 30;
    this.y = mob.y + mob.healthBarOffset.y;

    const healthPercentage = mob.health / mobInitialHealthMap[mob.mobTag];
    this.bar.clear();
    this.bar
      .fillStyle(0x00ff00, 1)
      .fillRoundedRect(5, 5, 50 * healthPercentage, 5, 2.5);
  }
}
