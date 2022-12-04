import { InventoryItemsEnum } from "../enums";
import { ICraftingRecipe } from "../types/crafting.types";

export const CraftingRecipes = Object.freeze([
  // Wood
  {
    item: InventoryItemsEnum.WOOD_PICKAXE_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.WOOD, quantity: 10 }]
  },
  {
    item: InventoryItemsEnum.WOOD_SWORD_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.WOOD, quantity: 10 }]
  },
  {
    item: InventoryItemsEnum.WOOD_HELMET_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.WOOD, quantity: 10 }]
  },

  // Stone
  {
    item: InventoryItemsEnum.STONE_PICKAXE_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.STONE, quantity: 10 }]
  },
  {
    item: InventoryItemsEnum.STONE_SWORD_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.STONE, quantity: 10 }]
  },
  {
    item: InventoryItemsEnum.STONE_HELMET_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.STONE, quantity: 10 }]
  },

  // Copper
  {
    item: InventoryItemsEnum.COPPER_PICKAXE_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.COPPER, quantity: 10 }]
  },
  {
    item: InventoryItemsEnum.COPPER_SWORD_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.COPPER, quantity: 10 }]
  },
  {
    item: InventoryItemsEnum.COPPER_HELMET_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.COPPER, quantity: 10 }]
  },

  // Iron
  {
    item: InventoryItemsEnum.IRON_PICKAXE_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.IRON, quantity: 10 }]
  },
  {
    item: InventoryItemsEnum.IRON_SWORD_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.IRON, quantity: 10 }]
  },
  {
    item: InventoryItemsEnum.IRON_HELMET_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.IRON, quantity: 10 }]
  },

  // Gold
  {
    item: InventoryItemsEnum.GOLD_PICKAXE_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.GOLD, quantity: 10 }]
  },
  {
    item: InventoryItemsEnum.GOLD_SWORD_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.GOLD, quantity: 10 }]
  },
  {
    item: InventoryItemsEnum.GOLD_HELMET_ITEM,
    quantity: 1,
    ingredients: [{ item: InventoryItemsEnum.GOLD, quantity: 10 }]
  }
] as Array<ICraftingRecipe>);
