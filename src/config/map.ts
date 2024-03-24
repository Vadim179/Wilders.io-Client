import { Texture } from "../enums/textureEnum";
import { TextureRenderingOrderEnum } from "../enums/textureRenderingOrderEnum";

export const spawners = Object.freeze([{ x: 0, y: 0 }]);

// TODO: Generate random rotations
export const mapDecorations = Object.freeze([
  {
    texture: Texture.LargeHill,
    x: 400,
    y: 100,
    id: "hill-1",
    order: TextureRenderingOrderEnum.LargeHill,
    radius: 20,
  },
  {
    texture: Texture.Pebble,
    x: 200,
    y: 200,
    id: "pebble-1",
    order: TextureRenderingOrderEnum.Pebble,
    radius: 20,
  },
  {
    texture: Texture.LargePinkFlower,
    x: 180,
    y: 300,
    id: "flower-1",
    order: TextureRenderingOrderEnum.LargePinkFlower,
    radius: 20,
  },
  {
    texture: Texture.SmallWhiteFlower,
    x: 250,
    y: 400,
    id: "flower-2",
    order: TextureRenderingOrderEnum.SmallWhiteFlower,
    radius: 20,
  },
  {
    texture: Texture.LargeWhiteFlower,
    x: 100,
    y: 450,
    id: "flower-3",
    order: TextureRenderingOrderEnum.LargeWhiteFlower,
    radius: 20,
  },
]);

export const mapEntities = Object.freeze([
  {
    texture: Texture.LargeRock,
    x: 350,
    y: 50,
    id: "stone-1",
    order: TextureRenderingOrderEnum.LargeRock,
    radius: 60,
  },
  {
    texture: Texture.SmallRock,
    x: 250,
    y: 30,
    id: "stone-2",
    order: TextureRenderingOrderEnum.SmallRock,
    radius: 40,
  },
  {
    texture: Texture.MediumOakTree,
    x: 500,
    y: 250,
    id: "tree-1",
    order: TextureRenderingOrderEnum.MediumOakTree,
    radius: 70,
  },
  {
    texture: Texture.HumongousOakTree,
    x: 650,
    y: 150,
    id: "tree-2",
    order: TextureRenderingOrderEnum.HumongousOakTree,
    radius: 120,
  },
]);
