import { Sprite } from "../components/Sprite";
import { inventoryItemOptionsMap } from "../config/inventoryConfig";
import { Texture } from "../enums/textureEnum";
import { TextureRenderingOrderEnum } from "../enums/textureRenderingOrderEnum";
import { Slot } from "../types/inventoryTypes";
import { SocketEvent } from "../enums/socketEvent";
import { sendBinaryDataToServer } from "../helpers/sendBinaryDataToServer";

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

  create() {
    const { scene, slot, itemQuantityTextOffset } = this;

    this.slotSprite = new Sprite({
      scene,
      x: 0,
      y: 0,
      texture: Texture.Slot,
      order: TextureRenderingOrderEnum.UI
    }).setAlpha(0.85);

    this.add(this.slotSprite);

    const [item, amount] = slot;

    if (item !== null) {
      const options = inventoryItemOptionsMap[item];

      this.itemSprite = new Sprite({
        scene,
        x: 0,
        y: 0,
        texture: options.texture,
        order: TextureRenderingOrderEnum.UI
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

  update() {
    const { scene, slotSprite, itemSprite, itemQuantityText } = this;
    const pointer = scene.input.activePointer;
    const bounds = slotSprite.getBounds();

    if (
      pointer.x > bounds.x &&
      pointer.x < bounds.x + bounds.width &&
      pointer.y > bounds.y &&
      pointer.y < bounds.y + bounds.height
    ) {
      slotSprite.setScale(1.1);
      itemSprite?.setScale(1.1);
    } else {
      slotSprite.setScale(1.0);
      itemSprite?.setScale(1.0);
    }
  }
}

export class InventoryGUI extends Phaser.GameObjects.Container {
  slotGap = 10;
  bottomMargin = 10;
  slots: Slot[];
  slotGUIs: InventorySlotGUI[] = [];
  clickEventAbortController: AbortController;

  constructor(scene: Phaser.Scene, private socket: WebSocket) {
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
      this.slotGUIs.push(slotGUI);
    });

    this.setDepth(TextureRenderingOrderEnum.UI);
    this.setScrollFactor(0);

    this.clickEventAbortController = new AbortController();
    window.addEventListener(
      "click",
      (event) => {
        this.slotGUIs.forEach((slotGUI, index) => {
          const bounds = slotGUI.getBounds();

          if (
            event.clientX > bounds.x &&
            event.clientX < bounds.x + bounds.width &&
            event.clientY > bounds.y &&
            event.clientY < bounds.y + bounds.height
          ) {
            const slot = this.slots[index];
            if (slot[0] !== null)
              sendBinaryDataToServer(this.socket, SocketEvent.UseItem, index);
          }
        });
      },
      {
        signal: this.clickEventAbortController.signal
      }
    );

    window.addEventListener("resize", () => this.setGUIPosition());
    this.setGUIPosition();
  }

  update(slots: number[]) {
    const changedSlots = [];

    for (let i = 0; i < slots.length; i += 3) {
      changedSlots.push([slots[i], slots[i + 1], slots[i + 2]]);
    }

    this.slotGUIs = [];
    this.slots = this.slots.map((slot, index) => {
      const changedSlot = changedSlots.find(
        (changedSlot) => changedSlot[0] === index
      );

      return changedSlot ? [changedSlot[1], changedSlot[2]] : slot;
    });

    this.removeAll(true);
    this.clickEventAbortController.abort();
    this.create();
  }

  sceneUpdate() {
    this.slotGUIs.forEach((slotGUI) => slotGUI.update());
  }
}
