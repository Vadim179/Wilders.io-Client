import { Item } from "../enums/itemEnum";
import { WeaponOrToolCategory } from "../enums/weaponOrToolCategory";

export const itemToWeaponOrToolCategoryMap = {
  [Item.WoodPickaxe]: WeaponOrToolCategory.Pickaxe,
  [Item.WoodSword]: WeaponOrToolCategory.Sword,
  [Item.StonePickaxe]: WeaponOrToolCategory.Pickaxe,
  [Item.StoneSword]: WeaponOrToolCategory.Sword
};
