import { EntityFactory } from '../factories'
import { SpriteRenderingOrder, StatColors } from '../config'
import { StatTypeEnum } from '../enums'
import { StatType } from '../types'

class StatGUI extends Phaser.GameObjects.Container {
  value = 100

  barRectangle: Phaser.GameObjects.Rectangle
  barRectangleFullWidth: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public statType: StatType
  ) {
    super(scene, x, y, [])
    scene.add.existing(this)
    this.create()
  }

  private create() {
    const { scene, statType } = this

    const slotSprite = EntityFactory.createEntity({
      scene: this.scene,
      x: 0,
      y: 0,
      type: 'SLOT',
    })
      .setScale(0.85)
      .setOrigin(0)

    const slotIconSprite = EntityFactory.createEntity({
      scene: this.scene,
      x: slotSprite.displayWidth / 2,
      y: slotSprite.displayHeight / 2,
      type: `${statType}_ICON`,
    })

    const barBackgroundSprite = EntityFactory.createEntity({
      scene: this.scene,
      x: slotSprite.displayWidth / 2,
      y: slotSprite.displayHeight / 2,
      type: 'BAR_BACKGROUND',
    }).setOrigin(0, 0.5)

    const barOutlineSprite = EntityFactory.createEntity({
      scene: this.scene,
      x: slotSprite.displayWidth / 2,
      y: slotSprite.displayHeight / 2 + 1,
      type: 'BAR_OUTLINE',
    }).setOrigin(0, 0.5)

    this.barRectangleFullWidth =
      barBackgroundSprite.displayWidth - slotSprite.displayWidth / 2

    this.barRectangle = new Phaser.GameObjects.Rectangle(
      scene,
      slotSprite.displayWidth,
      barBackgroundSprite.displayHeight / 2,
      this.barRectangleFullWidth,
      barBackgroundSprite.displayHeight - 5,
      StatColors[statType]
    ).setOrigin(0)

    this.add([
      barBackgroundSprite,
      this.barRectangle,
      barOutlineSprite,
      slotSprite,
      slotIconSprite,
    ])
  }

  public update() {
    const { value, barRectangleFullWidth } = this

    this.barRectangle.width = Phaser.Math.Linear(
      this.barRectangle.width,
      (value / 100) * barRectangleFullWidth,
      0.1
    )
  }
}

export class StatsGUI extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, [])
    scene.add.existing(this)
    this.create()
  }

  statGUIs: Array<StatGUI> = []
  private create() {
    const statTypes = Object.values(StatTypeEnum)

    statTypes.forEach((statType, index) => {
      const statGUI = new StatGUI(this.scene, 0, index * 80, statType)
      this.statGUIs.push(statGUI)
      this.add(statGUI)
    })

    this.setPosition(10, 10)
    this.setScrollFactor(0)
    this.setDepth(SpriteRenderingOrder.indexOf('STATS'))
  }

  public updateStat(statType: StatType, value: number) {
    const statGUI = this.statGUIs.find(
      (statGUI) => statGUI.statType === statType
    )

    if (statGUI) {
      statGUI.value = value
    }

    return this
  }

  public updateStats(stats: { [key in StatType]: number }) {
    Object.entries(stats).forEach(([statType, value]) => {
      this.updateStat(statType.toUpperCase() as StatType, value)
    })

    return this
  }

  update() {
    this.statGUIs.forEach((statGUI) => statGUI.update())
  }
}
