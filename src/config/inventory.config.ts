import { InventoryItemsEnum, InventoryItemTypesEnum } from "../enums";

export const InventoryItems = Object.freeze({
  // Materials
  [InventoryItemsEnum.WOOD]: {
    id: InventoryItemsEnum.WOOD,
    name: "Wood",
    type: InventoryItemTypesEnum.MATERIAL
  },
  [InventoryItemsEnum.STONE]: {
    id: InventoryItemsEnum.STONE,
    name: "Stone",
    type: InventoryItemTypesEnum.MATERIAL
  },
  [InventoryItemsEnum.COPPER]: {
    id: InventoryItemsEnum.COPPER,
    name: "Copper",
    type: InventoryItemTypesEnum.MATERIAL
  },
  [InventoryItemsEnum.IRON]: {
    id: InventoryItemsEnum.IRON,
    name: "Iron",
    type: InventoryItemTypesEnum.MATERIAL
  },
  [InventoryItemsEnum.GOLD]: {
    id: InventoryItemsEnum.GOLD,
    name: "Gold",
    type: InventoryItemTypesEnum.MATERIAL
  },

  // Pickaxes
  [InventoryItemsEnum.WOOD_PICKAXE_ITEM]: {
    id: InventoryItemsEnum.WOOD_PICKAXE_ITEM,
    name: "Wood Pickaxe",
    type: InventoryItemTypesEnum.TOOL
  },
  [InventoryItemsEnum.STONE_PICKAXE_ITEM]: {
    id: InventoryItemsEnum.STONE_PICKAXE_ITEM,
    name: "Stone Pickaxe",
    type: InventoryItemTypesEnum.TOOL
  },
  [InventoryItemsEnum.COPPER_PICKAXE_ITEM]: {
    id: InventoryItemsEnum.COPPER_PICKAXE_ITEM,
    name: "Copper Pickaxe",
    type: InventoryItemTypesEnum.TOOL
  },
  [InventoryItemsEnum.IRON_PICKAXE_ITEM]: {
    id: InventoryItemsEnum.IRON_PICKAXE_ITEM,
    name: "Iron Pickaxe",
    type: InventoryItemTypesEnum.TOOL
  },
  [InventoryItemsEnum.GOLD_PICKAXE_ITEM]: {
    id: InventoryItemsEnum.GOLD_PICKAXE_ITEM,
    name: "Gold Pickaxe",
    type: InventoryItemTypesEnum.TOOL
  },

  // Swords
  [InventoryItemsEnum.WOOD_SWORD_ITEM]: {
    id: InventoryItemsEnum.WOOD_SWORD_ITEM,
    name: "Wood Sword",
    type: InventoryItemTypesEnum.WEAPON
  },
  [InventoryItemsEnum.STONE_SWORD_ITEM]: {
    id: InventoryItemsEnum.STONE_SWORD_ITEM,
    name: "Stone Sword",
    type: InventoryItemTypesEnum.WEAPON
  },
  [InventoryItemsEnum.COPPER_SWORD_ITEM]: {
    id: InventoryItemsEnum.COPPER_SWORD_ITEM,
    name: "Copper Sword",
    type: InventoryItemTypesEnum.WEAPON
  },
  [InventoryItemsEnum.IRON_SWORD_ITEM]: {
    id: InventoryItemsEnum.IRON_SWORD_ITEM,
    name: "Iron Sword",
    type: InventoryItemTypesEnum.WEAPON
  },
  [InventoryItemsEnum.GOLD_SWORD_ITEM]: {
    id: InventoryItemsEnum.GOLD_SWORD_ITEM,
    name: "Gold Sword",
    type: InventoryItemTypesEnum.WEAPON
  },

  // Helmets
  [InventoryItemsEnum.WOOD_HELMET_ITEM]: {
    id: InventoryItemsEnum.WOOD_HELMET_ITEM,
    name: "Wood Helmet",
    type: InventoryItemTypesEnum.ARMOR
  },
  [InventoryItemsEnum.STONE_HELMET_ITEM]: {
    id: InventoryItemsEnum.STONE_HELMET_ITEM,
    name: "Stone Helmet",
    type: InventoryItemTypesEnum.ARMOR
  },
  [InventoryItemsEnum.COPPER_HELMET_ITEM]: {
    id: InventoryItemsEnum.COPPER_HELMET_ITEM,
    name: "Copper Helmet",
    type: InventoryItemTypesEnum.ARMOR
  },
  [InventoryItemsEnum.IRON_HELMET_ITEM]: {
    id: InventoryItemsEnum.IRON_HELMET_ITEM,
    name: "Iron Helmet",
    type: InventoryItemTypesEnum.ARMOR
  },
  [InventoryItemsEnum.GOLD_HELMET_ITEM]: {
    id: InventoryItemsEnum.GOLD_HELMET_ITEM,
    name: "Gold Helmet",
    type: InventoryItemTypesEnum.ARMOR
  },

  // Food
  [InventoryItemsEnum.BERRY]: {
    id: InventoryItemsEnum.BERRY,
    name: "Berry",
    type: InventoryItemTypesEnum.CONSUMABLE
  },
  [InventoryItemsEnum.APPLE]: {
    id: InventoryItemsEnum.APPLE,
    name: "Apple",
    type: InventoryItemTypesEnum.CONSUMABLE
  }
});

export const StarterInventoryItems = Object.freeze({
  [InventoryItemsEnum.WOOD]: 10,
  [InventoryItemsEnum.STONE]: 200,
  [InventoryItemsEnum.COPPER]: 1000,
  [InventoryItemsEnum.IRON]: 50000,
  [InventoryItemsEnum.GOLD]: 100
});
