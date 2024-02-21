import { Item } from "../enums/itemEnum";
import { Texture } from "../enums/textureEnum";

export const inventoryItemToOptions = Object.freeze({
  [Item.Wood]: {
    name: "Wood",
    texture: Texture.Wood
  },
  [Item.Stone]: {
    name: "Stone",
    texture: Texture.Stone
  }
});
