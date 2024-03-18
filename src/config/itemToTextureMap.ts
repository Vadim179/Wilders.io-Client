import { Item } from "../enums/itemEnum";
import { Texture } from "../enums/textureEnum";

export const itemTextureMap = {
  [Item.Wood]: Texture.Wood,
  [Item.WoodPickaxe]: Texture.WoodPickaxe,
  [Item.WoodSword]: Texture.WoodSword,
  [Item.WoodHelmet]: Texture.CopperHelmet,
  [Item.Stone]: Texture.Stone,
  [Item.Apple]: Texture.Apple,
  [Item.StoneHelmet]: Texture.GoldHelmet,
  [Item.StonePickaxe]: Texture.StonePickaxe,
  [Item.StoneSword]: Texture.StoneSword,
};
