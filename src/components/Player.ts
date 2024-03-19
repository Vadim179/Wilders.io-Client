import { Sprite, SpriteConstructorParams } from "./Sprite";
import { Position } from "../types/mapTypes";
import { Texture } from "../enums/textureEnum";
import { TextureRenderingOrderEnum } from "../enums/textureRenderingOrderEnum";
import { Item } from "../enums/itemEnum";
import { itemTextureMap } from "../config/itemToTextureMap";
import { itemToWeaponOrToolCategoryMap } from "../config/itemToWeaponOrToolCategoryMap";
import { WeaponOrToolCategory } from "../enums/weaponOrToolCategory";
import { lerp } from "../helpers/lerp";
import { lerpAngle } from "../helpers/lerpAngle";

interface PlayerConstructorParams
  extends Omit<SpriteConstructorParams, "texture"> {
  username: string;
  isOtherPlayer?: boolean;
}

const weaponOrToolCategoryToOffsetMap = {
  [WeaponOrToolCategory.Pickaxe]: { x: 5, y: -5, angle: 45 },
  [WeaponOrToolCategory.Sword]: { x: 0, y: -30, angle: 0 },
};

export class Player extends Phaser.GameObjects.Container {
  targetX = 0;
  targetY = 0;
  targetAngle = 0;
  isOtherPlayer = false;

  equipedItem: Phaser.GameObjects.Sprite;

  usernameTextOffset = { x: 0, y: -60 };
  chatBubbleOffset = { x: 0, y: -90 };
  armSpriteOffset = { x: 45, y: -20 };

  usernameText: Phaser.GameObjects.Text;
  bodySprite: Sprite;

  leftArmTargetOffset: Position;
  leftArmTargetRotation = 0;
  leftArmSprite: PlayerArm;
  leftArmTween: Phaser.Tweens.Tween;

  rightArmTargetOffset: Position;
  rightArmTargetRotation = 0;
  rightArmSprite: PlayerArm;
  rightArmTween: Phaser.Tweens.Tween;

  tintSprite: Phaser.GameObjects.Ellipse;
  tintTween: Phaser.Tweens.Tween;

  helmet: Phaser.GameObjects.Sprite | null = null;
  weaponOrTool: Phaser.GameObjects.Sprite | null = null;

  chatBubbles: ChatBubble[] = [];

  constructor({
    scene,
    x,
    y,
    username,
    isOtherPlayer = false,
  }: PlayerConstructorParams) {
    super(scene, x, y, []);

    this.targetX = x;
    this.targetY = y;
    this.isOtherPlayer = isOtherPlayer;

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
      y: armSpriteOffset.y,
    });

    this.leftArmSprite = new PlayerArm({
      scene,
      texture: Texture.WilderRightArm,
      x: armSpriteOffset.x,
      y: armSpriteOffset.y,
    });

    this.bodySprite = new Sprite({
      scene,
      texture: Texture.Wilder,
      x: 0,
      y: 0,
    });

    this.tintSprite = new Phaser.GameObjects.Ellipse(
      scene,
      0,
      0,
      this.bodySprite.displayWidth,
      this.bodySprite.displayHeight,
      0xff0000,
      0,
    );

    this.tintSprite.setDepth(TextureRenderingOrderEnum.WilderTint);
    this.tintSprite.setBlendMode(Phaser.BlendModes.HUE);

    this.add([
      this.leftArmSprite,
      this.rightArmSprite,
      this.bodySprite,
      this.tintSprite,
    ]);
  }

  private renderUsername(username: string) {
    const { scene, usernameTextOffset, x, y } = this;

    const usernameTextX = x + usernameTextOffset.x;
    const usernameTextY = y + usernameTextOffset.y;

    const usernameTextStyle: Partial<Phaser.GameObjects.TextStyle> = {
      align: "center",
      fontSize: "16px",
      fontFamily: "slackey",
    };

    const usernameText = new Phaser.GameObjects.Text(
      scene,
      usernameTextX,
      usernameTextY,
      username,
      usernameTextStyle,
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
      ease: "Linear",
    });

    this.rightArmTween = this.scene.tweens.add({
      targets: this.rightArmSprite,
      x: -armSpriteOffset.x,
      y: armSpriteOffset.y,
      rotation: 0,
      duration: 200,
      ease: "Linear",
    });
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

  createChatBubble(text: string) {
    const { scene, chatBubbleOffset } = this;

    const chatBubble = new ChatBubble(
      scene,
      text,
      chatBubbleOffset.x,
      chatBubbleOffset.y,
    );

    chatBubble.on("destroy", () => {
      this.chatBubbles = this.chatBubbles.filter(
        (bubble) => bubble !== chatBubble,
      );
    });

    this.chatBubbles.unshift(chatBubble);
  }

  playDamageAnimation() {
    if (this.tintTween) {
      return;
    }

    this.tintTween = this.scene.tweens.add({
      targets: this.tintSprite,
      fillAlpha: 0.3,
      duration: 150,
      yoyo: true,
      ease: "Linear",
    });

    this.tintTween.on("complete", () => {
      this.tintTween.remove();
      this.tintTween = null;
    });
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
        y: -5, // TODO: Fix the sprite, not the position
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
        y: offset.y,
      });

      this.weaponOrTool.setAngle(offset.angle);
      this.leftArmSprite.addAt(this.weaponOrTool);
    }
  }

  update() {
    const {
      targetX,
      targetY,
      targetAngle,
      isOtherPlayer,
      usernameTextOffset,
      leftArmTween,
      leftArmTargetOffset,
      leftArmTargetRotation,
      rightArmTween,
      rightArmTargetOffset,
      rightArmTargetRotation,
    } = this;

    const newX = lerp(this.x, targetX, 0.075);
    const newY = lerp(this.y, targetY, 0.075);
    this.setPosition(newX, newY);

    if (isOtherPlayer) {
      this.angle = lerpAngle(this.angle, targetAngle, 0.075);
    }

    leftArmTween.updateTo("x", leftArmTargetOffset.x, true);
    leftArmTween.updateTo("y", leftArmTargetOffset.y, true);
    leftArmTween.updateTo("rotation", leftArmTargetRotation, true);
    leftArmTween.restart();

    rightArmTween.updateTo("x", rightArmTargetOffset.x, true);
    rightArmTween.updateTo("y", rightArmTargetOffset.y, true);
    rightArmTween.updateTo("rotation", rightArmTargetRotation, true);
    rightArmTween.restart();

    this.emit("positionChanged", { x: this.x, y: this.y });

    const usernameTextX = newX + usernameTextOffset.x;
    const usernameTextY = newY + usernameTextOffset.y;
    this.usernameText.setPosition(usernameTextX, usernameTextY);

    this.chatBubbles.forEach((bubble, index) => {
      bubble.y = newY + usernameTextOffset.y - 30 - 35 * index;
      bubble.x = newX;
    });
  }

  override destroy() {
    this.leftArmSprite.destroy();
    this.rightArmSprite.destroy();
    this.bodySprite.destroy();
    this.usernameText.destroy();
    super.destroy();
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
      order: TextureRenderingOrderEnum.WilderArm,
    });

    this.add(this.arm);
  }

  override destroy() {
    this.arm.destroy();
    super.destroy();
  }
}

class ChatBubble extends Phaser.GameObjects.Container {
  chatBubble: Phaser.GameObjects.Graphics;
  chatText: Phaser.GameObjects.Text;

  chatBubbleTween: Phaser.Tweens.Tween;
  chatTextTween: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, text: string, x: number, y: number) {
    super(scene, x, y);
    this.depth = TextureRenderingOrderEnum.ChatBubble;
    this.render(text);
  }

  private render(text: string) {
    const { scene } = this;

    this.chatBubble = new Phaser.GameObjects.Graphics(scene);

    this.chatText = new Phaser.GameObjects.Text(scene, 0, 0, text, {
      align: "center",
      fontSize: "16px",
      fontFamily: "slackey",
    })
      .setOrigin(0.5)
      .setAlpha(0);

    this.add([this.chatBubble, this.chatText]);
    scene.add.existing(this);

    const chatTextBounds = this.chatText.getBounds();
    const bubbleWidth = chatTextBounds.width + 20;
    const bubbleHeight = 30;

    this.chatBubble.x = -bubbleWidth / 2;
    this.chatBubble.y = -bubbleHeight / 2;

    this.chatText.x = this.chatBubble.x + bubbleWidth / 2;
    this.chatText.y = this.chatBubble.y + bubbleHeight / 2;

    this.chatBubble
      .clear()
      .fillStyle(0x000000, 0)
      .fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 10);

    this.chatTextTween = scene.tweens.add({
      targets: this.chatText,
      alpha: 1,
      duration: 250,
      ease: "Linear",
      onComplete: () => {
        this.chatTextTween.remove();

        this.chatTextTween = scene.tweens.add({
          targets: this.chatText,
          alpha: 0,
          delay: 6000,
          duration: 250,
          ease: "Linear",
        });
      },
    });

    let bubbleAlpha = { value: 0 };
    this.chatBubbleTween = scene.tweens.add({
      targets: bubbleAlpha,
      value: 0.5,
      duration: 250,
      ease: "Linear",
      onUpdate: () => {
        this.chatBubble.clear().fillStyle(0x000000, bubbleAlpha.value);
        this.chatBubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 10);
      },
      onComplete: () => {
        this.chatBubbleTween = scene.tweens.add({
          targets: bubbleAlpha,
          value: 0,
          delay: 6000,
          duration: 250,
          ease: "Linear",
          onUpdate: () => {
            this.chatBubble.clear().fillStyle(0x000000, bubbleAlpha.value);
            this.chatBubble.fillRoundedRect(
              0,
              0,
              bubbleWidth,
              bubbleHeight,
              10,
            );
          },
          onComplete: () => {
            this.chatBubbleTween.remove();
            this.chatText.destroy();
            this.chatBubble.destroy();
            this.destroy();
          },
        });
      },
    });
  }
}
