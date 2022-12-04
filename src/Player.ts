import { SpriteRenderingOrder } from "./config";
import { Sprite, ISpriteConstructorParams } from "./factories";

interface IPlayerConstructorParams
  extends Omit<ISpriteConstructorParams, "texture"> {
  username: string;
}

export class Player extends Phaser.GameObjects.Container {
  sightX = 1440;
  sightY = 900;

  usernameTextOffset = { x: 0, y: -80 };
  armSpriteOffset = { x: 50, y: -30 };

  usernameText: Phaser.GameObjects.Text;
  bodySprite: Phaser.GameObjects.Sprite;
  leftArmSprite: Phaser.GameObjects.Sprite;
  rightArmSprite: Phaser.GameObjects.Sprite;

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

    this.rightArmSprite = new Sprite({
      scene,
      texture: "WILDER_LEFT_ARM",
      x: -armSpriteOffset.x,
      y: armSpriteOffset.y
    });

    this.leftArmSprite = new Sprite({
      scene,
      texture: "WILDER_RIGHT_ARM",
      x: armSpriteOffset.x,
      y: armSpriteOffset.y
    });

    this.bodySprite = new Sprite({
      scene,
      texture: "WILDER",
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

  private start() {}

  public update() {
    const { x, y, usernameTextOffset } = this;
    this.setPosition(x, y);

    const usernameTextX = x + usernameTextOffset.x;
    const usernameTextY = y + usernameTextOffset.y;
    this.usernameText.setPosition(usernameTextX, usernameTextY);
  }
}
