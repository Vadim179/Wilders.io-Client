import { CraftingRecipes } from "../config";
import { Inventory } from "./inventory.system";
import { IInventoryItemStack, InventoryItem } from "../types";

export class Crafting {
  constructor(private inventory: Inventory) {}

  public craft(item: InventoryItem) {
    const recipe = this.getRecipe(item);

    if (this.inventory.isFull()) {
      throw new Error("Inventory is full");
    }

    if (this.hasIngredients(recipe.ingredients)) {
      this.removeIngredients(recipe.ingredients);
      this.addCraftedItem(recipe.item, recipe.quantity);
      return;
    }

    throw new Error("Not enough ingredients");
  }

  public getCaftableItemRecipes() {
    return CraftingRecipes.filter((recipe) =>
      this.hasIngredients(recipe.ingredients)
    );
  }

  private hasIngredients(ingredients: Array<IInventoryItemStack>) {
    return ingredients.every((ingredient) => {
      const slot = this.inventory.getSlotWithItem(ingredient.item);
      return slot && slot.quantity >= ingredient.quantity;
    });
  }

  private removeIngredients(ingredients: Array<IInventoryItemStack>) {
    ingredients.forEach((ingredient) => {
      this.inventory.removeItem(ingredient.item, ingredient.quantity);
    });
  }

  private addCraftedItem(item: InventoryItem, quantity: number) {
    this.inventory.addItem(item, quantity);
  }

  private getRecipe(item: string) {
    const recipe = CraftingRecipes.find((recipe) => recipe.item === item);

    if (recipe === undefined) {
      throw new Error(`Recipe not found for item: ${item}`);
    }

    return recipe;
  }
}
