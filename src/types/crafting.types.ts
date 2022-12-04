import { IInventoryItemStack, InventoryItem } from "./inventory.types";

export interface ICraftingRecipe {
  item: InventoryItem;
  quantity: number;
  ingredients: Array<IInventoryItemStack>;
}
