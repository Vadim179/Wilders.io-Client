import { Item } from "../enums/itemEnum";
import { Texture } from "../enums/textureEnum";

export const inventoryItemOptionsMap = {
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
    texture: Texture.CopperHelmet,
    equipableItemTexture: Texture.CopperHelmet,
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
    texture: Texture.GoldHelmet,
    equipableItemTexture: Texture.GoldHelmet,
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
} as const;
