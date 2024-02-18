import { IMapEntity } from "../types/map.types";

export const MapEntities = Object.freeze([
  // Decorations
  { type: "LARGE_HILL", x: 400, y: 100, id: "hill1" },
  { type: "PEBBLE", x: 200, y: 200, id: "pebble1" },
  { type: "LARGE_PINK_FLOWER", x: 180, y: 300, id: "flower1" },
  { type: "SMALL_WHITE_FLOWER", x: 250, y: 400, id: "flower2" },
  { type: "LARGE_WHITE_FLOWER", x: 100, y: 450, id: "flower3" },

  // Physical objects
  { type: "LARGE_ROCK", x: 350, y: 50, id: "rock1" },
  { type: "MEDIUM_DARK_OAK_TREE", x: 500, y: 250, id: "tree1" },
  { type: "LARGE_OAK_TREE", x: 650, y: 150, id: "tree2" }
] as Array<IMapEntity>);
