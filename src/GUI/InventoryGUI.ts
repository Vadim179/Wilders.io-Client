import { SpriteRenderingOrder } from "../config";
import { EntityFactory, Sprite } from "../factories";
import { Inventory, InventorySlot } from "../components";

class InventorySlotGUI extends Phaser.GameObjects.Container {
  slotSprite: Sprite;
  itemSprite: Sprite;

  itemQuantityText: Phaser.GameObjects.Text;
  itemQuantityTextOffset = { x: 0, y: -60 };

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private slot: InventorySlot
  ) {
    super(scene, x, y, []);
    scene.add.existing(this);
    this.create();
  }

  private create() {
    const { scene, slot, itemQuantityTextOffset } = this;

    this.slotSprite = EntityFactory.createSprite({
      scene,
      x: 0,
      y: 0,
      texture: "SLOT",
      zIndex: "SLOT"
    });

    this.add(this.slotSprite);

    if (slot.item) {
      this.itemSprite = EntityFactory.createSprite({
        scene,
        x: 0,
        y: 0,
        texture: slot.item,
        zIndex: slot.item
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
        `x${slot.quantity.toString()}`,
        itemQuantityTextStyle
      ).setOrigin(0.5);

      this.add([this.itemSprite, this.itemQuantityText]);
    }
  }
}

export class InventoryGUI extends Phaser.GameObjects.Container {
  slotGap = 10;
  bottomMargin = 10;

  constructor(scene: Phaser.Scene, private inventory: Inventory) {
    super(scene, 0, 0);
    inventory.on("update", () => this.update());

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
    this.inventory.slots.forEach((slot, index) => {
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

  update() {
    // this.removeAll(true);
    // this.create();
  }
}
