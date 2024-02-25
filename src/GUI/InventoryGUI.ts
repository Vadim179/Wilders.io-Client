import { Sprite } from "../components/Sprite";
import { Item } from "../enums/itemEnum";
import { inventoryItemOptionsMap } from "../config/inventoryConfig";
import { SpriteRenderingOrder } from "../config/rendering.config";
import { Texture } from "../enums/textureEnum";

type Slot = [Item | null, number];

class InventorySlotGUI extends Phaser.GameObjects.Container {
  slotSprite: Sprite;
  itemSprite: Sprite;

  itemQuantityText: Phaser.GameObjects.Text;
  itemQuantityTextOffset = { x: 0, y: -60 };

  constructor(scene: Phaser.Scene, x: number, y: number, private slot: Slot) {
    super(scene, x, y, []);
    scene.add.existing(this);
    this.create();
  }

  private create() {
    const { scene, slot, itemQuantityTextOffset } = this;

    this.slotSprite = new Sprite({
      scene,
      x: 0,
      y: 0,
      texture: Texture.Slot,
      zIndex: "SLOT"
    });

    this.add(this.slotSprite);

    const [item, amount] = slot;

    if (item !== null) {
      const options = inventoryItemOptionsMap[item];

      this.itemSprite = new Sprite({
        scene,
        x: 0,
        y: 0,
        texture: options.texture,
        zIndex: options.texture
      });

      const itemQuantityTextStyle = {
        color: "#ffffff",
        fontSize: "12px",
        fontFamily: "slackey",
        align: "center"
      };

      this.itemQuantityText = new Phaser.GameObjects.Text(
        scene,
        itemQuantityTextOffset.x,
        itemQuantityTextOffset.y,
        `${amount.toString()}`,
        itemQuantityTextStyle
      ).setOrigin(0.5);

      this.add([this.itemSprite, this.itemQuantityText]);
    }
  }
}

export class InventoryGUI extends Phaser.GameObjects.Container {
  slotGap = 10;
  bottomMargin = 10;
  slots: Slot[];

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.slots = new Array(8).fill([null, 0]);
    scene.add.existing(this);
    this.create();
  }

  setGUIPosition() {
    const bounds = this.getBounds();

    this.setPosition(
      innerWidth / 2 - bounds.width / 2,
      innerHeight - this.bottomMargin
    );
  }

  create() {
    this.slots.forEach((slot, index) => {
      const slotGUI = new InventorySlotGUI(this.scene, 0, 0, slot);

      slotGUI.setPosition(
        index * (slotGUI.slotSprite.width + this.slotGap) +
          slotGUI.slotSprite.width / 2,
        -slotGUI.slotSprite.height / 2
      );

      this.add(slotGUI);
    });

    this.setDepth(SpriteRenderingOrder.indexOf("INVENTORY"));
    this.setScrollFactor(0);

    window.addEventListener("resize", () => this.setGUIPosition());
    this.setGUIPosition();
  }

  update(slots: Slot[]) {
    this.slots = slots;
    this.removeAll(true);
    this.create();
  }
}
