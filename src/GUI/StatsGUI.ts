import { Sprite } from "../components/Sprite";
import { Texture } from "../enums/textureEnum";
import { TextureRenderingOrderEnum } from "../enums/textureRenderingOrderEnum";

enum Stat {
  Hunger = 0,
  Temperature = 1,
  Health = 2
}

const statBarOptions = {
  [Stat.Health]: {
    color: 0xee3e75,
    iconTexture: Texture.HealthIcon
  },
  [Stat.Hunger]: {
    color: 0xba5c41,
    iconTexture: Texture.HungerIcon
  },
  [Stat.Temperature]: {
    color: 0xa5c7df,
    iconTexture: Texture.TemperatureIcon
  }
};

class StatGUI extends Phaser.GameObjects.Container {
  value = 100;
  flashTween: Phaser.Tweens.Tween | null = null;

  barRectangle: Phaser.GameObjects.Rectangle;
  barRectangleFullWidth: number;

  constructor(scene: Phaser.Scene, x: number, y: number, public statType: Stat) {
    super(scene, x, y, []);
    scene.add.existing(this);
    this.create();
  }

  create() {
    const { scene, statType } = this;
    const statOptions = statBarOptions[statType];

    const slotSprite = new Sprite({
      scene: this.scene,
      x: 0,
      y: 0,
      texture: Texture.Slot,
      order: TextureRenderingOrderEnum.UI
    })
      .setScale(0.85)
      .setOrigin(0);

    const slotIconSprite = new Sprite({
      scene: this.scene,
      x: slotSprite.displayWidth / 2,
      y: slotSprite.displayHeight / 2,
      texture: statOptions.iconTexture,
      order: TextureRenderingOrderEnum.UI
    });

    const barBackgroundSprite = new Sprite({
      scene: this.scene,
      x: slotSprite.displayWidth / 2,
      y: slotSprite.displayHeight / 2,
      texture: Texture.BarBackground,
      order: TextureRenderingOrderEnum.UI
    }).setOrigin(0, 0.5);

    const barOutlineSprite = new Sprite({
      scene: this.scene,
      x: slotSprite.displayWidth / 2,
      y: slotSprite.displayHeight / 2 + 1,
      texture: Texture.BarOutline,
      order: TextureRenderingOrderEnum.UI
    }).setOrigin(0, 0.5);

    this.barRectangleFullWidth =
      barBackgroundSprite.displayWidth - slotSprite.displayWidth / 2;

    this.barRectangle = new Phaser.GameObjects.Rectangle(
      scene,
      slotSprite.displayWidth,
      barBackgroundSprite.displayHeight / 2,
      this.barRectangleFullWidth,
      barBackgroundSprite.displayHeight - 5,
      statOptions.color
    ).setOrigin(0);

    this.add([
      barBackgroundSprite,
      this.barRectangle,
      barOutlineSprite,
      slotSprite,
      slotIconSprite
    ]);
  }

  update() {
    const { value, barRectangleFullWidth } = this;

    this.barRectangle.width = Phaser.Math.Linear(
      this.barRectangle.width,
      (value / 100) * barRectangleFullWidth,
      0.05
    );

    if (value < 30) {
      if (!this.flashTween) {
        this.flashTween = this.scene.tweens.add({
          targets: this.barRectangle,
          alpha: 0.1,
          duration: 400,
          yoyo: true,
          repeat: -1
        });
      }
    } else {
      if (this.flashTween) {
        this.flashTween.stop();
        this.flashTween = null;
        this.barRectangle.alpha = 1;
      }
    }
  }
}

export class StatsGUI extends Phaser.GameObjects.Container {
  statGUIs: StatGUI[] = [];

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, []);
    scene.add.existing(this);
    this.create();
  }

  create() {
    const statTypes = [Stat.Health, Stat.Hunger, Stat.Temperature];

    statTypes.forEach((statType, index) => {
      const statGUI = new StatGUI(this.scene, 0, (index + 1) * -80, statType);
      this.statGUIs.push(statGUI);
      this.add(statGUI);
    });

    this.setScrollFactor(0);
    this.setDepth(TextureRenderingOrderEnum.UI);

    window.addEventListener("resize", () => this.setPosition(10, innerHeight));
    this.setPosition(10, innerHeight);
  }

  updateStat(statType: Stat, value: number) {
    const statGUI = this.statGUIs.find((statGUI) => statGUI.statType === statType);

    if (statGUI) {
      statGUI.value = value;
    }

    return this;
  }

  updateStats(stats: number[]) {
    const [health, temperature, hunger] = stats;

    this.updateStat(Stat.Health, health)
      .updateStat(Stat.Temperature, temperature)
      .updateStat(Stat.Hunger, hunger);

    return this;
  }

  update() {
    this.statGUIs.forEach((statGUI) => statGUI.update());
  }
}
