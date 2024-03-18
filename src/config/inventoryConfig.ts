import { Item } from "../enums/itemEnum";
import { Texture } from "../enums/textureEnum";

export const inventoryItemOptionsMap = {
  [Item.Wood]: {
    name: "Wood",
    texture: Texture.Wood,
  },
  [Item.WoodPickaxe]: {
    name: "Wood Pickaxe",
    texture: Texture.WoodPickaxeItem,
  },
  [Item.WoodSword]: {
    name: "Wood Sword",
    texture: Texture.WoodSwordItem,
  },
  [Item.WoodHelmet]: {
    name: "Wood Helmet",
    texture: Texture.CopperHelmet,
  },
  [Item.Stone]: {
    name: "Stone",
    texture: Texture.Stone,
  },
  [Item.StoneSword]: {
    name: "Stone",
    texture: Texture.StoneSwordItem,
  },
  [Item.StoneHelmet]: {
    name: "Stone Helmet",
    texture: Texture.GoldHelmet,
  },
  [Item.StonePickaxe]: {
    name: "Stone Pickaxe",
    texture: Texture.StonePickaxeItem,
  },
};
