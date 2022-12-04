import { IMapEntity } from "../types/map.types";

export const MapEntities = Object.freeze([
  { type: "LARGE_HILL", x: 400, y: 100 },
  { type: "PEBBLE", x: 200, y: 200 },
  { type: "LARGE_PINK_FLOWER", x: 180, y: 300 },
  { type: "SMALL_WHITE_FLOWER", x: 250, y: 400 },
  { type: "LARGE_WHITE_FLOWER", x: 100, y: 450 },
  { type: "LARGE_ROCK", x: 350, y: 50 },
  { type: "MEDIUM_DARK_OAK_TREE", x: 500, y: 250 },
  { type: "LARGE_OAK_TREE", x: 650, y: 150 }
] as Array<IMapEntity>);
