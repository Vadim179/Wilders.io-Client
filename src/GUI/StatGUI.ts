import { Sprite } from "../components/Sprite";
import { SpriteRenderingOrder } from "../config/rendering.config";
import { Texture } from "../enums/textureEnum";

export enum StatType {
  Health = "HEALTH"
  // Hunger = "HUNGER",
  // Temperature = "TEMPERATURE"
}

const statColors = {
  [StatType.Health]: 0xee3e75
  // [StatType.Hunger]: 0xba5c41,
  // [StatType.Temperature]: 0xa5c7df
};

class StatGUI extends Phaser.GameObjects.Container {
  value = 100;

  barRectangle: Phaser.GameObjects.Rectangle;
  barRectangleFullWidth: number;

  constructor(scene: Phaser.Scene, x: number, y: number, public statType: StatType) {
    super(scene, x, y, []);
    scene.add.existing(this);
    this.create();
  }

  private create() {
    const { scene, statType } = this;

    const slotSprite = new Sprite({
      scene: this.scene,
      x: 0,
      y: 0,
      texture: Texture.Slot,
      zIndex: "SLOT"
    })
      .setScale(0.85)
      .setOrigin(0);

    const slotIconSprite = new Sprite({
      scene: this.scene,
      x: slotSprite.displayWidth / 2,
      y: slotSprite.displayHeight / 2,
      texture: `${statType}_ICON`,
      zIndex: `${statType}_ICON`
    });

    const barBackgroundSprite = new Sprite({
      scene: this.scene,
      x: slotSprite.displayWidth / 2,
      y: slotSprite.displayHeight / 2,
      texture: "BAR_BACKGROUND",
      zIndex: "BAR_BACKGROUND"
    }).setOrigin(0, 0.5);

    const barOutlineSprite = new Sprite({
      scene: this.scene,
      x: slotSprite.displayWidth / 2,
      y: slotSprite.displayHeight / 2 + 1,
      texture: "BAR_OUTLINE",
      zIndex: "BAR_OUTLINE"
    }).setOrigin(0, 0.5);

    this.barRectangleFullWidth =
      barBackgroundSprite.displayWidth - slotSprite.displayWidth / 2;

    this.barRectangle = new Phaser.GameObjects.Rectangle(
      scene,
      slotSprite.displayWidth,
      barBackgroundSprite.displayHeight / 2,
      this.barRectangleFullWidth,
      barBackgroundSprite.displayHeight - 5,
      statColors[statType]
    ).setOrigin(0);

    this.add([
      barBackgroundSprite,
      this.barRectangle,
      barOutlineSprite,
      slotSprite,
      slotIconSprite
    ]);
  }

  public update() {
    const { value, barRectangleFullWidth } = this;

    this.barRectangle.width = Phaser.Math.Linear(
      this.barRectangle.width,
      (value / 100) * barRectangleFullWidth,
      0.1
    );
  }
}

export class StatsGUI extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, []);
    scene.add.existing(this);
    this.create();
  }

  statGUIs: StatGUI[] = [];
  private create() {
    const statTypes = Object.values(StatType);

    statTypes.forEach((statType, index) => {
      const statGUI = new StatGUI(this.scene, 0, index * 80, statType);
      this.statGUIs.push(statGUI);
      this.add(statGUI);
    });

    this.setPosition(10, 10);
    this.setScrollFactor(0);
    this.setDepth(SpriteRenderingOrder.indexOf("STATS"));
  }

  public updateStat(statType: StatType, value: number) {
    const statGUI = this.statGUIs.find((statGUI) => statGUI.statType === statType);

    if (statGUI) {
      statGUI.value = value;
    }

    return this;
  }

  public updateStats(stats: { [key in StatType]: number }) {
    Object.entries(stats).forEach(([statType, value]) => {
      this.updateStat(statType.toUpperCase() as StatType, value);
    });

    return this;
  }

  update() {
    this.statGUIs.forEach((statGUI) => statGUI.update());
  }
}
