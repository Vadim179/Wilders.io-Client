import { MapEntities } from "../config";
import { IMapEntity } from "../types/map.types";
import { EntityFactory, Sprite } from "../factories";
import { Player } from "../Player";

export class GameMap {
  public static readonly width = 1000;
  public static readonly height = 1000;

  private entities: Array<IMapEntity> = [];
  private surroundingEntities: Array<IMapEntity> = [];
  private previousSurroundingEntities: Array<IMapEntity> = [];
  private renderedSprites: Array<Sprite> = [];

  constructor() {
    this.entities = this.loadEntities();
  }

  /**
   * Loads the map entities into memory and applies id's to them
   */
  private loadEntities() {
    return MapEntities.map((entity, index) => ({
      ...entity,
      id: String(index)
    }));
  }

  /**
   * Returns a list of all entities that are within the given radius of the given player
   */
  private getSurroundingEntities(player: Player) {
    return this.entities.filter(
      (entity) =>
        Math.abs(player.x - entity.x) <= player.sightX &&
        Math.abs(player.y - entity.y) <= player.sightY
    );
  }

  /**
   * Renders the given array of entities to the given scene
   */
  private render(scene: Phaser.Scene) {
    this.surroundingEntities.forEach(({ id, type, x, y }) => {
      if (this.renderedSprites.some((sprite) => sprite.id === id)) return;

      this.renderedSprites.push(
        EntityFactory.createEntity({ id, type, scene, x, y })
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
