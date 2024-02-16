import { SpriteRenderingOrder } from "./config";
import { EntityFactory, ISpriteConstructorParams } from "./factories";
import { IPosition } from "./types";

interface IPlayerConstructorParams
  extends Omit<ISpriteConstructorParams, "texture"> {
  username: string;
}

export class Player extends Phaser.GameObjects.Container {
  sightX = 1440;
  sightY = 900;

  equipedItem: Phaser.GameObjects.Sprite;

  usernameTextOffset = { x: 0, y: -80 };
  armSpriteOffset = { x: 50, y: -30 };

  usernameText: Phaser.GameObjects.Text;
  bodySprite: Phaser.GameObjects.Sprite;

  leftArmTargetOffset: IPosition;
  leftArmTargetRotation = 0;
  leftArmSprite: PlayerArm;
  leftArmTween: Phaser.Tweens.Tween;

  rightArmTargetOffset: IPosition;
  rightArmTargetRotation = 0;
  rightArmSprite: PlayerArm;
  rightArmTween: Phaser.Tweens.Tween;

  constructor({ scene, x, y, username }: IPlayerConstructorParams) {
    super(scene, x, y, []);

    this.render();
    this.renderUsername(username);

    this.setDepth(SpriteRenderingOrder.indexOf("WILDER"));
    this.usernameText.setDepth(SpriteRenderingOrder.indexOf("WILDER_USERNAME"));

    this.scene.add.existing(this);
    this.start();
  }

  private render() {
    const { scene, armSpriteOffset } = this;

    this.rightArmSprite = new PlayerArm({
      scene,
      texture: "WILDER_LEFT_ARM",
      x: -armSpriteOffset.x,
      y: armSpriteOffset.y
    });

    this.leftArmSprite = new PlayerArm({
      scene,
      texture: "WILDER_RIGHT_ARM",
      x: armSpriteOffset.x,
      y: armSpriteOffset.y
    });

    this.bodySprite = EntityFactory.createEntity({
      scene,
      type: "WILDER",
      x: 0,
      y: 0
    });

    this.add([this.leftArmSprite, this.rightArmSprite, this.bodySprite]);
  }

  private renderUsername(username: string) {
    const { scene, usernameTextOffset, x, y } = this;

    const usernameTextX = x + usernameTextOffset.x;
    const usernameTextY = y + usernameTextOffset.y;

    const usernameTextStyle: Partial<Phaser.GameObjects.TextStyle> = {
      align: "center",
      fontSize: "16px",
      fontFamily: "slackey"
    };

    const usernameText = new Phaser.GameObjects.Text(
      scene,
      usernameTextX,
      usernameTextY,
      username,
      usernameTextStyle
    ).setOrigin(0.5);

    scene.add.existing(usernameText);
    this.usernameText = usernameText;
  }

  private start() {
    const { armSpriteOffset } = this;

    this.leftArmTargetOffset = { ...armSpriteOffset };
    this.rightArmTargetOffset = { ...armSpriteOffset, x: -armSpriteOffset.x };

    this.leftArmTween = this.scene.tweens.add({
      targets: this.leftArmSprite,
      x: armSpriteOffset.x,
      y: armSpriteOffset.y,
      rotation: 0,
      duration: 200,
      ease: "Linear"
    });

    this.rightArmTween = this.scene.tweens.add({
      targets: this.rightArmSprite,
      x: -armSpriteOffset.x,
      y: armSpriteOffset.y,
      rotation: 0,
      duration: 200,
      ease: "Linear"
    });

    this.rotation;
  }

  // TODO: Refactor this method
  attackWithLeft = false;
  public playAttackAnimation() {
    if (this.attackWithLeft) {
      this.leftArmTargetOffset = { x: 0, y: -70 };
      this.leftArmTargetRotation = -45 * (Math.PI / 180);
      this.rightArmTargetOffset = { x: -60, y: -10 };
  
      setTimeout(() => {
        this.leftArmTargetOffset = { x: 50, y: -30 };
        this.leftArmTargetRotation = 0;
        this.rightArmTargetOffset = { x: -50, y: -30 };
      }, 200);
    } else {
      this.rightArmTargetOffset = { x: 0, y: -70 };
      this.rightArmTargetRotation = 45 * (Math.PI / 180);
      this.leftArmTargetOffset = { x: 60, y: -10 };
  
      setTimeout(() => {
        this.rightArmTargetOffset = { x: -50, y: -30 };
        this.rightArmTargetRotation = 0;
        this.leftArmTargetOffset = { x: 50, y: -30 };
      }, 200);
    }
  
    this.attackWithLeft = false; // Toggle the attackWithLeft flag
  }
  

  // TODO: Refactor this method
  public equip(type:string, item: string) {
    if (type === 'head') {
      this.equipedItem = EntityFactory.createEntity({
        scene: this.scene,
        type: item,
        x: 0,
        y: -5
      });

      this.add(this.equipedItem);
      return;
    }
    if(type === 'left_arm'){
      this.rightArmSprite.equip(item);
    }
    if(type === 'right_arm'){
      this.leftArmSprite.equip(item);
    }

  }

  public update() {
    const {
      x,
      y,
      usernameTextOffset,
      leftArmTween,
      leftArmTargetOffset,
      leftArmTargetRotation,
      rightArmTween,
      rightArmTargetOffset,
      rightArmTargetRotation
    } = this;

    this.setPosition(x, y);

    leftArmTween.updateTo("x", leftArmTargetOffset.x, true);
    leftArmTween.updateTo("y", leftArmTargetOffset.y, true);
    leftArmTween.updateTo("rotation", leftArmTargetRotation, true);
    leftArmTween.restart();

    rightArmTween.updateTo("x", rightArmTargetOffset.x, true);
    rightArmTween.updateTo("y", rightArmTargetOffset.y, true);
    rightArmTween.updateTo("rotation", rightArmTargetRotation, true);
    rightArmTween.restart();

    const usernameTextX = x + usernameTextOffset.x;
    const usernameTextY = y + usernameTextOffset.y;
    this.usernameText.setPosition(usernameTextX, usernameTextY);
  }
}

class PlayerArm extends Phaser.GameObjects.Container {
  animationTween: Phaser.Tweens.Tween;

  armTexture: string;
  arm: Phaser.GameObjects.Sprite;

  equipedItem: Phaser.GameObjects.Sprite;

  constructor({ scene, x, y, texture }: ISpriteConstructorParams) {
    super(scene, x, y, []);
    this.armTexture = texture;

    this.setDepth(SpriteRenderingOrder.indexOf("WILDER_ARM"));
    this.scene.add.existing(this);
    this.start();
  }

  private start() {
    this.arm = EntityFactory.createEntity({
      scene: this.scene,
      type: this.armTexture,
      x: 0,
      y: 0
    });

    this.arm.setDepth(SpriteRenderingOrder.indexOf("WILDER_ARM"));
    this.add(this.arm);
  }

  public equip(item: string) {
    if (this.equipedItem) {
      this.equipedItem.destroy();
      this.equipedItem = null;
    }

    this.equipedItem = EntityFactory.createEntity({
      scene: this.scene,
      type: item,
      x: 0,
      y: -30
    });

    this.equipedItem.setDepth(SpriteRenderingOrder.indexOf("WILDER_ARM_ITEM"));
    this.add(this.equipedItem);
    this.bringToTop(this.arm);
  }

  public update() {}
}
