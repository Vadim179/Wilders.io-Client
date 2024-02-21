import { InventoryItemsEnum } from "../enums";

export type InventoryItem = keyof typeof InventoryItemsEnum;

export interface IInventoryItemStack {
  item: InventoryItem;
  quantity: number;
}
