import { Item } from "../enums/itemEnum";

export interface toolRangeAndRadiusMap {
  toolRange: number;
  toolRadius: number;
}

export const toolRangeAndRadiusMap: Record<number, toolRangeAndRadiusMap> = {
  [Item.WoodPickaxe]: { toolRange: 60, toolRadius: 40 },
  [Item.StonePickaxe]: { toolRange: 60, toolRadius: 40 },
  [Item.IronPickaxe]: { toolRange: 60, toolRadius: 40 },
  [Item.GoldPickaxe]: { toolRange: 60, toolRadius: 40 },
  [Item.DiamondPickaxe]: { toolRange: 60, toolRadius: 40 },
  [Item.EmeraldPickaxe]: { toolRange: 60, toolRadius: 40 },
  [Item.WoodSword]: { toolRange: 80, toolRadius: 40 },
  [Item.StoneSword]: { toolRange: 80, toolRadius: 40 },
  [Item.IronSword]: { toolRange: 80, toolRadius: 40 },
  [Item.GoldSword]: { toolRange: 80, toolRadius: 40 },
  [Item.DiamondSword]: { toolRange: 80, toolRadius: 40 },
  [Item.EmeraldSword]: { toolRange: 80, toolRadius: 40 },
};
