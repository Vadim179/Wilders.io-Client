import { Sprite, SpriteConstructorParams } from "./Sprite";
import { Position } from "../types/mapTypes";
import { Texture } from "../enums/textureEnum";
import { TextureRenderingOrderEnum } from "../enums/textureRenderingOrderEnum";
import { Item } from "../enums/itemEnum";
import { inventoryItemOptionsMap } from "../config/inventoryConfig";
import { itemTextureMap } from "../config/itemToTextureMap";
import { itemToWeaponOrToolCategoryMap } from "../config/itemToWeaponOrToolCategoryMap";
import { WeaponOrToolCategory } from "../enums/weaponOrToolCategory";
import { lerp } from "../helpers/lerp";

interface PlayerConstructorParams extends Omit<SpriteConstructorParams, "texture"> {
  username: string;
}

const weaponOrToolCategoryToOffsetMap = {
  [WeaponOrToolCategory.Pickaxe]: { x: 5, y: -5, angle: 45 },
  [WeaponOrToolCategory.Sword]: { x: 0, y: -30, angle: 0 }
};

export class Player extends Phaser.GameObjects.Container {
  targetX = 0;
  targetY = 0;

  equipedItem: Phaser.GameObjects.Sprite;

  usernameTextOffset = { x: 0, y: -80 };
  armSpriteOffset = { x: 45, y: -20 };

  usernameText: Phaser.GameObjects.Text;
  bodySprite: Phaser.GameObjects.Sprite;

  leftArmTargetOffset: Position;
  leftArmTargetRotation = 0;
  leftArmSprite: PlayerArm;
  leftArmTween: Phaser.Tweens.Tween;

  rightArmTargetOffset: Position;
  rightArmTargetRotation = 0;
  rightArmSprite: PlayerArm;
  rightArmTween: Phaser.Tweens.Tween;

  helmet: Phaser.GameObjects.Sprite | null = null;
  weaponOrTool: Phaser.GameObjects.Sprite | null = null;

  constructor({ scene, x, y, username }: PlayerConstructorParams) {
    super(scene, x, y, []);

    this.targetX = x;
    this.targetY = y;

    this.render();
    this.renderUsername(username);

    this.setDepth(TextureRenderingOrderEnum.Wilder);
    this.usernameText.setDepth(TextureRenderingOrderEnum.Username);

    this.scene.add.existing(this);
    this.start();
  }

  private render() {
    const { scene, armSpriteOffset } = this;

    this.rightArmSprite = new PlayerArm({
      scene,
      texture: Texture.WilderLeftArm,
      x: -armSpriteOffset.x,
      y: armSpriteOffset.y
    });

    this.leftArmSprite = new PlayerArm({
      scene,
      texture: Texture.WilderRightArm,
      x: armSpriteOffset.x,
      y: armSpriteOffset.y
    });

    this.bodySprite = new Sprite({
      scene,
      texture: Texture.Wilder,
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
  playAttackAnimation() {
    if (this.weaponOrTool || this.attackWithLeft) {
      this.leftArmTargetOffset = { x: 0, y: -70 };
      this.leftArmTargetRotation = -45 * (Math.PI / 180);
      this.rightArmTargetOffset = { x: -45, y: -10 };

      setTimeout(() => {
        this.leftArmTargetOffset = { x: 45, y: -20 };
        this.leftArmTargetRotation = 0;
        this.rightArmTargetOffset = { x: -45, y: -20 };
      }, 200);
    } else if (!this.attackWithLeft) {
      this.rightArmTargetOffset = { x: 0, y: -70 };
      this.rightArmTargetRotation = 45 * (Math.PI / 180);
      this.leftArmTargetOffset = { x: 45, y: -10 };

      setTimeout(() => {
        this.rightArmTargetOffset = { x: -45, y: -20 };
        this.rightArmTargetRotation = 0;
        this.leftArmTargetOffset = { x: 45, y: -20 };
      }, 200);
    }

    this.attackWithLeft = this.weaponOrTool ? true : !this.attackWithLeft;
  }

  updateHelmet(helmet: Item | null) {
    if (this.helmet !== null) {
      this.helmet.destroy();
      this.helmet = null;
    }

    if (helmet !== null) {
      const texture = itemTextureMap[helmet];

      this.helmet = new Sprite({
        texture,
        scene: this.scene,
        order: TextureRenderingOrderEnum.Helmet,
        x: 0,
        y: -5 // TODO: Fix the sprite, not the position
      });

      this.add(this.helmet);
    }
  }

  updateWeaponOrTool(weaponOrTool: Item | null) {
    if (this.weaponOrTool !== null) {
      this.weaponOrTool.destroy();
      this.weaponOrTool = null;
    }

    if (weaponOrTool !== null) {
      const texture = itemTextureMap[weaponOrTool];
      const category = itemToWeaponOrToolCategoryMap[weaponOrTool];
      const offset = weaponOrToolCategoryToOffsetMap[category];

      this.weaponOrTool = new Sprite({
        texture,
        scene: this.scene,
        order: TextureRenderingOrderEnum.WeaponOrTool,
        x: offset.x,
        y: offset.y
      });

      this.weaponOrTool.setAngle(offset.angle);
      this.leftArmSprite.addAt(this.weaponOrTool);
    }
  }

  update() {
    const {
      targetX,
      targetY,
      usernameTextOffset,
      leftArmTween,
      leftArmTargetOffset,
      leftArmTargetRotation,
      rightArmTween,
      rightArmTargetOffset,
      rightArmTargetRotation
    } = this;

    const newX = lerp(this.x, targetX, 0.1);
    const newY = lerp(this.y, targetY, 0.1);
    this.setPosition(newX, newY);

    leftArmTween.updateTo("x", leftArmTargetOffset.x, true);
    leftArmTween.updateTo("y", leftArmTargetOffset.y, true);
    leftArmTween.updateTo("rotation", leftArmTargetRotation, true);
    leftArmTween.restart();

    rightArmTween.updateTo("x", rightArmTargetOffset.x, true);
    rightArmTween.updateTo("y", rightArmTargetOffset.y, true);
    rightArmTween.updateTo("rotation", rightArmTargetRotation, true);
    rightArmTween.restart();

    const usernameTextX = newX + usernameTextOffset.x;
    const usernameTextY = newY + usernameTextOffset.y;
    this.usernameText.setPosition(usernameTextX, usernameTextY);
  }
}

class PlayerArm extends Phaser.GameObjects.Container {
  animationTween: Phaser.Tweens.Tween;

  armTexture: Texture;
  arm: Phaser.GameObjects.Sprite;

  constructor({ scene, x, y, texture }: SpriteConstructorParams) {
    super(scene, x, y, []);
    this.armTexture = texture;
    this.scene.add.existing(this);
    this.start();
  }

  private start() {
    this.arm = new Sprite({
      scene: this.scene,
      texture: this.armTexture,
      x: 0,
      y: 0,
      order: TextureRenderingOrderEnum.WilderArm
    });

    this.add(this.arm);
  }
}
