import { Texture } from "../enums/textureEnum";

export const MapEntities = Object.freeze([
  // Decorations
  { texture: Texture.LargeHill, x: 400, y: 100, id: NaN },
  { texture: Texture.Pebble, x: 200, y: 200, id: NaN },
  { texture: Texture.LargePinkFlower, x: 180, y: 300, id: NaN },
  { texture: Texture.SmallWhiteFlower, x: 250, y: 400, id: NaN },
  { texture: Texture.LargeWhiteFlower, x: 100, y: 450, id: NaN },

  // Physical objects
  { texture: Texture.LargeRock, x: 350, y: 50, id: 1 },
  { texture: Texture.LargeDarkOakTree, x: 500, y: 250, id: 2 },
  { texture: Texture.LargeOakTree, x: 650, y: 150, id: 3 }
]);
