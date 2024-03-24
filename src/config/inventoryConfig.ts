import { Item } from "../enums/itemEnum";
import { Texture } from "../enums/textureEnum";

interface InventoryItemOptions {
  name: string;
  texture: Texture;
  equipableItemTexture: Texture | null;
  placement?: { x: number; y: number };
}

export const inventoryItemOptionsMap: Record<Item, InventoryItemOptions> = {
  [Item.Wood]: {
    name: "Wood",
    texture: Texture.Wood,
    equipableItemTexture: null,
  },
  [Item.WoodPickaxe]: {
    name: "Wood Pickaxe",
    texture: Texture.WoodPickaxeItem,
    equipableItemTexture: Texture.WoodPickaxe,
  },
  [Item.WoodSword]: {
    name: "Wood Sword",
    texture: Texture.WoodSwordItem,
    equipableItemTexture: Texture.WoodSword,
  },
  [Item.WoodHelmet]: {
    name: "Wood Helmet",
    texture: Texture.WoodHelmet,
    equipableItemTexture: Texture.WoodHelmet,
    placement: { x: 0, y: -5 },
  },
  [Item.Stone]: {
    name: "Stone",
    texture: Texture.Stone,
    equipableItemTexture: null,
  },
  [Item.StoneSword]: {
    name: "Stone",
    texture: Texture.StoneSwordItem,
    equipableItemTexture: Texture.StoneSword,
  },
  [Item.StoneHelmet]: {
    name: "Stone Helmet",
    texture: Texture.StoneHelmet,
    equipableItemTexture: Texture.StoneHelmet,
    placement: { x: 0, y: 21 },
  },
  [Item.StonePickaxe]: {
    name: "Stone Pickaxe",
    texture: Texture.StonePickaxeItem,
    equipableItemTexture: Texture.StonePickaxe,
  },
  [Item.WolfFur]: {
    name: "Wolf Fur",
    texture: Texture.WolfFur,
    equipableItemTexture: null,
  },
  [Item.RawMeat]: {
    name: "Raw Meat",
    texture: Texture.RawMeat,
    equipableItemTexture: null,
  },
  [Item.IronPickaxe]: {
    name: "Iron Pickaxe",
    texture: Texture.IronPickaxeItem,
    equipableItemTexture: Texture.IronPickaxe,
  },
  [Item.IronSword]: {
    name: "Iron Sword",
    texture: Texture.IronSwordItem,
    equipableItemTexture: Texture.IronSword,
  },
  [Item.GoldPickaxe]: {
    name: "Gold Pickaxe",
    texture: Texture.GoldPickaxeItem,
    equipableItemTexture: Texture.GoldPickaxe,
  },
  [Item.GoldSword]: {
    name: "Gold Sword",
    texture: Texture.GoldSwordItem,
    equipableItemTexture: Texture.GoldSword,
  },
  [Item.DiamondPickaxe]: {
    name: "Diamond Pickaxe",
    texture: Texture.GoldPickaxeItem,
    equipableItemTexture: Texture.GoldPickaxe,
  },
  [Item.DiamondSword]: {
    name: "Diamond Sword",
    texture: Texture.GoldSwordItem,
    equipableItemTexture: Texture.GoldSword,
  },
  [Item.EmeraldPickaxe]: {
    name: "Emerald Pickaxe",
    texture: Texture.GoldPickaxeItem,
    equipableItemTexture: Texture.GoldPickaxe,
  },
  [Item.EmeraldSword]: {
    name: "Emerald Sword",
    texture: Texture.GoldSwordItem,
    equipableItemTexture: Texture.GoldSword,
  },
  [Item.Apple]: {
    name: "Apple",
    texture: Texture.Apple,
    equipableItemTexture: Texture.Apple,
  },
} as const;
