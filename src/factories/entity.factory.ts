import * as uuid from "uuid";
import { SpriteRenderingOrder } from "../config";

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
    this.setDepth(SpriteRenderingOrder.indexOf(texture));
    this.scene.add.existing(this);
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
