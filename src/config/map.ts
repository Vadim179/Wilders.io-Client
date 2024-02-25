import { Texture } from "../enums/textureEnum";
import { TextureRenderingOrderEnum } from "../enums/textureRenderingOrderEnum";

export const texturesWithShadows = [
  Texture.AppleTree,
  Texture.LargeDarkOakTree,
  Texture.LargeOakTree,
  Texture.MediumDarkOakTree,
  Texture.MediumOakTree,
  Texture.SmallDarkOakTree,
  Texture.SmallOakTree
];

// TODO: Generate random rotations

export const mapEntities = Object.freeze([
  // Decorations
  {
    texture: Texture.LargeHill,
    x: 400,
    y: 100,
    id: "h1",
    order: TextureRenderingOrderEnum.LargeHill
  },
  {
    texture: Texture.Pebble,
    x: 200,
    y: 200,
    id: "p1",
    order: TextureRenderingOrderEnum.Pebble
  },
  {
    texture: Texture.LargePinkFlower,
    x: 180,
    y: 300,
    id: "f1",
    order: TextureRenderingOrderEnum.LargePinkFlower
  },
  {
    texture: Texture.SmallWhiteFlower,
    x: 250,
    y: 400,
    id: "f2",
    order: TextureRenderingOrderEnum.SmallWhiteFlower
  },
  {
    texture: Texture.LargeWhiteFlower,
    x: 100,
    y: 450,
    id: "f3",
    order: TextureRenderingOrderEnum.LargeWhiteFlower
  },

  // Physical objects
  {
    texture: Texture.LargeRock,
    x: 350,
    y: 50,
    id: "r1",
    order: TextureRenderingOrderEnum.LargeRock
  },
  {
    texture: Texture.LargeDarkOakTree,
    x: 500,
    y: 250,
    id: "t1",
    order: TextureRenderingOrderEnum.LargeDarkOakTree
  },
  {
    texture: Texture.LargeOakTree,
    x: 650,
    y: 150,
    id: "t2",
    order: TextureRenderingOrderEnum.LargeOakTree
  }
]);
