import { MapEntity } from "../Types";

export const MapEntities = Object.freeze([
  { type: "LargeHill", x: 400, y: 100 },
  { type: "Pebble", x: 200, y: 200 },
  { type: "LargePinkFlower", x: 180, y: 300 },
  { type: "SmallWhiteFlower", x: 250, y: 400 },
  { type: "LargeWhiteFlower", x: 100, y: 450 },
  { type: "LargeRock", x: 350, y: 50 },
  { type: "MediumDarkOakTree", x: 500, y: 250 },
  { type: "LargeOakTree", x: 650, y: 150 }
] as Array<MapEntity>);

export const EntitiesRenderingOrder = Object.freeze([
  "SmallHill",
  "LargeHill",
  "StonePath",
  "Lake",

  "Pebble",
  "SmallGreenFlower",
  "SmallPinkFlower",
  "SmallWhiteFlower",
  "LargePinkFlower",
  "LargeWhiteFlower",

  "Bush",
  "Berry",

  "SmallRock",
  "SmallCopperOre",
  "SmallIronOre",
  "SmallGoldOre",

  "LargeRock",
  "LargeCopperOre",
  "LargeIronOre",
  "LargeGoldOre",

  "WilderLeftArm",
  "WilderRightArm",
  "Wilder",
  "WilderUsername",

  "AppleTree",
  "Apple",

  "SmallDarkOakTree",
  "SmallOakTree",

  "MediumDarkOakTree",
  "MediumOakTree",

  "LargeDarkOakTree",
  "LargeOakTree"
]);
