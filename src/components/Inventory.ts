import EventEmitter = require("events");
import { InventoryItem } from "../types";

export class InventorySlot {
  item: InventoryItem | null = null;
  quantity: number = 0;

  public isEmpty() {
    return this.item === null;
  }

  public add(item: InventoryItem, quantity: number) {
    if (this.item === null) {
      this.item = item;
      this.quantity = quantity;
      return;
    }

    if (this.item === item) {
      this.quantity += quantity;
      return;
    }

    throw new Error("Inventory slot item mismatch");
  }

  public remove(quantity: number) {
    if (this.item === null) {
      return;
    }

    this.quantity -= quantity;

    if (this.quantity <= 0) {
      this.item = null;
      this.quantity = 0;
    }
  }
}

export class Inventory extends EventEmitter {
  slotsCount: number;
  slots: Array<InventorySlot>;

  constructor(slotsCount: number) {
    super();

    this.slotsCount = slotsCount;
    this.slots = new Array(slotsCount).fill(null).map(() => new InventorySlot());
  }

  public isFull() {
    return this.slots.every((slot) => !slot.isEmpty());
  }

  public getItems() {
    return this.slots.map((slot) => ({
      item: slot.item,
      quantity: slot.quantity
    }));
  }

  public addItem(item: InventoryItem, quantity: number) {
    const slot = this.getSlotWithItem(item) || this.getEmptySlot();

    if (slot) {
      slot.add(item, quantity);
      this.emit("update", this.getItems());
    }
  }

  public removeItem(item: InventoryItem, quantity: number) {
    const slot = this.getSlotWithItem(item);

    if (slot) {
      slot.remove(quantity);

      if (slot.isEmpty()) {
        this.shiftSlots(slot);
      }

      this.emit("update", this.getItems());
    }
  }

  private shiftSlots(slot: InventorySlot) {
    const slotIndex = this.slots.indexOf(slot);

    for (let i = slotIndex; i < this.slots.length - 1; i++) {
      this.slots[i] = this.slots[i + 1];
    }

    this.slots[this.slots.length - 1] = new InventorySlot();
  }

  public getSlotWithItem(item: InventoryItem): InventorySlot | null {
    return this.slots.find((slot) => slot.item === item) || null;
  }

  private getEmptySlot(): InventorySlot | null {
    return this.slots.find((slot) => slot.isEmpty()) || null;
  }
}
