import { Texture } from "../enums/textureEnum";
import { TextureRenderingOrderEnum } from "../enums/textureRenderingOrderEnum";

// TODO: Generate random rotations
export const mapDecorations = Object.freeze([
  {
    texture: Texture.LargeHill,
    x: 400,
    y: 100,
    id: "hill-1",
    order: TextureRenderingOrderEnum.LargeHill
  },
  {
    texture: Texture.Pebble,
    x: 200,
    y: 200,
    id: "pebble-1",
    order: TextureRenderingOrderEnum.Pebble
  },
  {
    texture: Texture.LargePinkFlower,
    x: 180,
    y: 300,
    id: "flower-1",
    order: TextureRenderingOrderEnum.LargePinkFlower
  },
  {
    texture: Texture.SmallWhiteFlower,
    x: 250,
    y: 400,
    id: "flower-2",
    order: TextureRenderingOrderEnum.SmallWhiteFlower
  },
  {
    texture: Texture.LargeWhiteFlower,
    x: 100,
    y: 450,
    id: "flower-3",
    order: TextureRenderingOrderEnum.LargeWhiteFlower
  }
]);

export const mapEntities = Object.freeze([
  {
    texture: Texture.LargeRock,
    x: 350,
    y: 50,
    id: "stone-1",
    order: TextureRenderingOrderEnum.LargeRock
  },
  {
    texture: Texture.LargeDarkOakTree,
    x: 500,
    y: 250,
    id: "tree-1",
    order: TextureRenderingOrderEnum.LargeDarkOakTree
  },
  {
    texture: Texture.LargeOakTree,
    x: 650,
    y: 150,
    id: "tree-2",
    order: TextureRenderingOrderEnum.LargeOakTree
  }
]);
