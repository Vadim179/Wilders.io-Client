interface ISpriteConstructorParams {
  scene: Phaser.Scene
  x: number
  y: number
  texture: string
}

class Sprite extends Phaser.GameObjects.Sprite {
  constructor({ scene, x, y, texture }: ISpriteConstructorParams) {
    super(scene, x, y, texture)
    this.scene.add.existing(this)
  }

  renderShadow() {
    const { scene, x, y, texture } = this
    const shadow = new Phaser.GameObjects.Sprite(scene, x, y, texture)

    shadow.setTint(0x000000)
    shadow.setAlpha(0.25)
    shadow.setScale(1, 1)
    shadow.setPosition(this.x + 10, this.y + 10)
    shadow.setDepth(this.depth - 1)

    this.scene.add.existing(this)
    return this
  }

  update() {}
}

interface IWilderConstructorParams
  extends Omit<ISpriteConstructorParams, "texture"> {
  username: string
}

class Wilder extends Phaser.GameObjects.Container {
  usernameTextOffset = { x: 0, y: -80 }
  usernameText: Phaser.GameObjects.Text | null = null

  constructor({ scene, x, y, username }: IWilderConstructorParams) {
    super(scene, x, y, [])

    this.render()
    this.renderUsername(username)

    this.scene.add.existing(this)
  }

  update() {
    const { usernameText, usernameTextOffset, x, y } = this

    if (usernameText) {
      const usernameTextX = x + usernameTextOffset.x
      const usernameTextY = y + usernameTextOffset.y
      usernameText.setPosition(usernameTextX, usernameTextY)
    }
  }

  render() {
    const { scene } = this

    const armY = -30
    const armX = 50

    const leftArm = new Sprite({
      scene,
      texture: "WilderLeftArm",
      x: -armX,
      y: armY,
    })

    const rightArm = new Sprite({
      scene,
      texture: "WilderRightArm",
      x: armX,
      y: armY,
    })

    const body = new Sprite({
      scene,
      texture: "Wilder",
      x: 0,
      y: 0,
    })

    this.add([leftArm, rightArm, body])
  }

  renderUsername(username: string) {
    const { scene, usernameTextOffset, x, y } = this

    const usernameTextX = x + usernameTextOffset.x
    const usernameTextY = y + usernameTextOffset.y

    const usernameTextStyle: Partial<Phaser.GameObjects.TextStyle> = {
      align: "center",
      fontSize: "16px",
      fontFamily: "slackey",
    }

    const usernameText = new Phaser.GameObjects.Text(
      scene,
      usernameTextX,
      usernameTextY,
      username,
      usernameTextStyle,
    ).setOrigin(0.5)

    scene.add.existing(usernameText)
    this.usernameText = usernameText
  }
}

type EntityParams = Omit<ISpriteConstructorParams, "texture">

export class EntityFactory {
  static Wilder = ({ scene, username, x, y }: IWilderConstructorParams) =>
    new Wilder({ scene, username, x, y })

  static Bush = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "Bush" }).renderShadow()

  static AppleTree = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "AppleTree" }).renderShadow()

  static LargeGoldOre = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "LargeGoldOre" }).renderShadow()

  static LargeIronOre = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "LargeIronOre" }).renderShadow()

  static LargeCopperOre = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "LargeCopperOre" }).renderShadow()

  static LargeRock = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "LargeRock" }).renderShadow()

  static SmallCopperOre = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "SmallCopperOre" }).renderShadow()

  static SmallGoldOre = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "SmallGoldOre" }).renderShadow()

  static SmallIronOre = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "SmallIronOre" }).renderShadow()

  static SmallRock = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "SmallRock" }).renderShadow()

  static LargeDarkOakTree = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "LargeDarkOakTree" }).renderShadow()

  static LargeOakTree = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "LargeOakTree" }).renderShadow()

  static MediumDarkOakTree = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "MediumDarkOakTree" }).renderShadow()

  static MediumOakTree = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "MediumOakTree" }).renderShadow()

  static SmallDarkOakTree = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "SmallDarkOakTree" }).renderShadow()

  static SmallOakTree = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "SmallOakTree" }).renderShadow()

  static LargeHill = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "LargeHill" })

  static SmallHill = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "SmallHill" })

  static LargePinkFlower = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "LargePinkFlower" })

  static LargeWhiteFlower = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "LargeWhiteFlower" })

  static SmallGreenFlower = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "SmallGreenFlower" })

  static SmallPinkFlower = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "SmallPinkFlower" })

  static SmallWhiteFlower = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "SmallWhiteFlower" })

  static Pebble = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "Pebble" })

  static StonePath = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "StonePath" })

  static Lake = ({ scene, x, y }: EntityParams) =>
    new Sprite({ scene, x, y, texture: "Lake" })
}
