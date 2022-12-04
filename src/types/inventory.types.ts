import { InventoryItemsEnum, InventoryItemTypesEnum } from "../enums";

export type InventoryItem = keyof typeof InventoryItemsEnum;

export type InventoryItemType = keyof typeof InventoryItemTypesEnum;

export interface IInventoryItemStack {
  item: InventoryItem;
  quantity: number;
}
