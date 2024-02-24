import * as uuid from "uuid";
import { SpriteRenderingOrder } from "../config/rendering.config";

export interface SpriteConstructorParams {
  id?: string;
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  zIndex?: string;
}

class BaseSprite extends Phaser.GameObjects.Sprite {
  id: string;

  constructor({ id, scene, x, y, texture, zIndex }: SpriteConstructorParams) {
    super(scene, x, y, texture);
    this.id = id || uuid.v4();

    if (zIndex) {
      this.setDepth(SpriteRenderingOrder.indexOf(zIndex));
    }

    this.scene.add.existing(this);
    this.create();
  }

  update() {}

  create() {}
}

export interface ContainerConstructorParams
  extends Omit<ISpriteConstructorParams, "texture"> {}

class BaseContainer extends Phaser.GameObjects.Container {
  id: string;

  constructor({ id, scene, x, y, zIndex }: ContainerConstructorParams) {
    super(scene, x, y);
    this.id = id || uuid.v4();

    if (zIndex) {
      this.setDepth(SpriteRenderingOrder.indexOf(zIndex));
    }

    this.scene.add.existing(this);
    this.create();
  }

  create() {}

  update() {}
}

export class Sprite extends BaseSprite {}

export class Container extends BaseContainer {}

export class EntityFactory {
  static createSprite(entityParams: ISpriteConstructorParams) {
    return new Sprite(entityParams);
  }

  static createContainer(contaianerParams: IContainerConstructorParams) {
    return new Container(contaianerParams);
  }
}
