import { Sprite } from "./Sprite";
import { Player } from "./Player";
import { mapDecorations, mapEntities } from "../config/map";
import { Position } from "../types/mapTypes";

type Entity = (typeof mapEntities)[number];

export class GameMap {
  static readonly width = 1000;
  static readonly height = 1000;
  readonly entitySightRadius = 1200;

  private surroundingEntities: Entity[] = [];
  private previousSurroundingEntities: Entity[] = [];
  private renderedSprites: Sprite[] = [];

  resourceAttack(id: string, angleInRadians: number) {
    const sprite = this.renderedSprites.find((sprite) => sprite.id === id);
    if (sprite) sprite.attack(angleInRadians);
  }

  /**
   * Returns a list of all entities that are within the given radius of the given player
   */
  private getSurroundingEntities(player: Player) {
    return [...mapEntities, ...mapDecorations].filter(
      (entity) =>
        Math.abs(player.x - entity.x) <= this.entitySightRadius &&
        Math.abs(player.y - entity.y) <= this.entitySightRadius
    );
  }

  /**
   * Renders the given array of entities to the given scene
   */
  private render(scene: Phaser.Scene) {
    this.surroundingEntities.forEach(({ id, texture, x, y, order }) => {
      if (this.renderedSprites.some((sprite) => sprite.id === id)) return;

      this.renderedSprites.push(new Sprite({ id, texture, scene, x, y, order }));
    });
  }

  getEntitiesInRange(position: Position, radius: number) {
    const entityRadius = 60;
    return this.surroundingEntities.filter(
      (entity) =>
        Math.abs(position.x - entity.x) <= radius + entityRadius &&
        Math.abs(position.y - entity.y) <= radius + entityRadius
    );
  }

  update(player: Player) {
    this.surroundingEntities = this.getSurroundingEntities(player);

    // Remove any entities that are no longer in the player's sight radius
    this.previousSurroundingEntities
      .filter(
        (entity) =>
          !this.surroundingEntities.some((e) => e.id === entity.id) &&
          this.renderedSprites.some((sprite) => sprite.id === entity.id)
      )
      .forEach((entity) => {
        const sprite = this.renderedSprites.find(
          (sprite) => sprite.id === entity.id
        );

        this.renderedSprites = this.renderedSprites.filter(
          (sprite) => sprite.id !== entity.id
        );

        sprite?.destroy();
      });

    this.render(player.scene);
    this.previousSurroundingEntities = this.surroundingEntities;
    return this;
  }
}
