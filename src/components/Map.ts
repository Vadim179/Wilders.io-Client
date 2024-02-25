import { Sprite } from "./Sprite";
import { Player } from "./Player";
import { mapEntities } from "../config/map";

type Entity = (typeof mapEntities)[number];

export class GameMap {
  public static readonly width = 1000;
  public static readonly height = 1000;

  private surroundingEntities: Entity[] = [];
  private previousSurroundingEntities: Entity[] = [];
  private renderedSprites: Sprite[] = [];

  /**
   * Returns a list of all entities that are within the given radius of the given player
   */
  private getSurroundingEntities(player: Player) {
    return mapEntities.filter(
      (entity) =>
        Math.abs(player.x - entity.x) <= player.sightX &&
        Math.abs(player.y - entity.y) <= player.sightY
    );
  }

  /**
   * Renders the given array of entities to the given scene
   */
  private render(scene: Phaser.Scene) {
    this.surroundingEntities.forEach(({ id, texture, x, y }) => {
      if (this.renderedSprites.some((sprite) => sprite.id === id)) return;

      this.renderedSprites.push(
        new Sprite({ id, texture, scene, x, y, zIndex: texture })
      );
    });
  }

  public update(player: Player) {
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
