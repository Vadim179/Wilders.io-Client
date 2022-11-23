import * as uuid from "uuid";
import { EntitiesRenderingOrder } from "./config";

export interface ISpriteConstructorParams {
  id?: string;
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
}

export class Sprite extends Phaser.GameObjects.Sprite {
  id: string;

  constructor({ id, scene, x, y, texture }: ISpriteConstructorParams) {
    super(scene, x, y, texture);

    this.id = id || uuid.v4();
    this.setDepth(EntitiesRenderingOrder.indexOf(texture));
    this.scene.add.existing(this);
  }

  renderShadow() {
    const { scene, x, y, texture } = this;
    const shadow = new Phaser.GameObjects.Sprite(scene, x, y, texture);

    shadow.setTint(0x000000);
    shadow.setAlpha(0.25);
    shadow.setScale(1, 1);
    shadow.setPosition(this.x + 10, this.y + 10);
    shadow.setDepth(this.depth - 1);

    this.scene.add.existing(shadow);
    return this;
  }

  update() {}
}

interface ICreateEntityParams extends Omit<ISpriteConstructorParams, "texture"> {
  type: string;
}

export class EntityFactory {
  static createEntity({ id, scene, type, x, y }: ICreateEntityParams) {
    return new Sprite({ id, scene, x, y, texture: type });
  }
}
