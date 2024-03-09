import { Socket } from "socket.io-client";
import { Sprite } from "../components/Sprite";
import { InventoryItemStack, craftingRecipes } from "../config/craftingRecipes";
import { inventoryItemOptionsMap } from "../config/inventoryConfig";
import { TextureRenderingOrderEnum } from "../enums/textureRenderingOrderEnum";
import { Slot } from "../types/inventoryTypes";

export class CraftingGUI extends Phaser.GameObjects.Container {
  slots: Slot[];
  itemGap = 10;
  clickEventAbortController: AbortController;

  constructor(scene: Phaser.Scene, private socket: Socket) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.slots = new Array(8).fill([null, 0]);
    this.create();
  }

  getCraftableRecipes() {
    return craftingRecipes.filter((recipe) =>
      this.hasIngredients(recipe.ingredients)
    );
  }

  hasIngredients(ingredients: Array<InventoryItemStack>) {
    return ingredients.every((ingredient) => {
      const slot = this.slots.find(([slotItem]) => slotItem === ingredient.item);
      return slot && slot[1] >= ingredient.quantity;
    });
  }

  create() {
    const { scene } = this;

    const columns = 4;
    const itemSize = 64;
    const recipes = this.getCraftableRecipes();
    const sprites: Sprite[] = [];

    recipes.forEach((recipe, index) => {
      const recipeItemOptions = inventoryItemOptionsMap[recipe.item];
      const row = Math.floor(index / columns);
      const column = index % columns;

      const x = column * (itemSize + this.itemGap);
      const y = row * (itemSize + this.itemGap);

      const sprite = new Sprite({
        scene,
        x,
        y,
        texture: recipeItemOptions.texture,
        order: TextureRenderingOrderEnum.UI
      });

      sprite.setAlpha(0.75);
      sprites.push(sprite);
      this.add(sprite);
    });

    this.clickEventAbortController = new AbortController();
    window.addEventListener(
      "click",
      (event) => {
        sprites.forEach((sprite, index) => {
          const bounds = sprite.getBounds();

          if (
            event.clientX > bounds.x &&
            event.clientX < bounds.x + bounds.width &&
            event.clientY > bounds.y &&
            event.clientY < bounds.y + bounds.height
          ) {
            const recipe = recipes[index];
            this.socket.emit("craft", recipe.item);
          }
        });
      },
      {
        signal: this.clickEventAbortController.signal
      }
    );

    this.setPosition(42, 42);
    this.setDepth(TextureRenderingOrderEnum.UI);
    this.setScrollFactor(0);
  }

  update(slots: Slot[]) {
    this.clickEventAbortController.abort();
    this.slots = slots;
    this.removeAll(true);
    this.create();
  }
}
