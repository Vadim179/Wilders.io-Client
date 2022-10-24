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

    this.scene.add.existing(shadow)
    return this
  }

  update() {}
}

interface IWilderConstructorParams
  extends Omit<ISpriteConstructorParams, "texture"> {
  username: string
}

class Wilder extends Phaser.GameObjects.Container {
  targetX = 0
  targetY = 0
  positionTween: Phaser.Tweens.Tween

  usernameTextOffset = { x: 0, y: -80 }
  usernameText: Phaser.GameObjects.Text

  bodySprite: Phaser.GameObjects.Sprite

  armSpriteOffset = { x: 50, y: -30 }
  leftArmTargetOffset = { x: 50, y: -30 }
  leftArmSprite: Phaser.GameObjects.Sprite
  leftArmPositionTween: Phaser.Tweens.Tween

  rightArmTargetOffset = { x: -50, y: -30 }
  rightArmSprite: Phaser.GameObjects.Sprite
  rightArmPositionTween: Phaser.Tweens.Tween

  constructor({ scene, x, y, username }: IWilderConstructorParams) {
    super(scene, x, y, [])

    this.targetX = x
    this.targetY = y

    this.render()
    // this.renderUsername(username)

    this.scene.add.existing(this)
    this.start()
  }

  render() {
    const { scene, armSpriteOffset } = this

    this.rightArmSprite = new Sprite({
      scene,
      texture: "WilderLeftArm",
      x: -armSpriteOffset.x,
      y: armSpriteOffset.y,
    })

    this.leftArmSprite = new Sprite({
      scene,
      texture: "WilderRightArm",
      x: armSpriteOffset.x,
      y: armSpriteOffset.y,
    })

    this.bodySprite = new Sprite({
      scene,
      texture: "Wilder",
      x: 0,
      y: 0,
    })

    this.add([this.leftArmSprite, this.rightArmSprite, this.bodySprite])
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

  start() {
    const { scene, armSpriteOffset } = this

    this.positionTween = scene.tweens.add({
      targets: this,
      x: 0,
      y: 0,
      ease: "Linear",
      duration: 300,
    })

    this.leftArmPositionTween = scene.tweens.add({
      targets: this.leftArmSprite,
      x: armSpriteOffset.x,
      y: armSpriteOffset.y,
      ease: "Linear",
      duration: 200,
    })

    this.rightArmPositionTween = scene.tweens.add({
      targets: this.rightArmSprite,
      x: -armSpriteOffset.x,
      y: armSpriteOffset.y,
      ease: "Linear",
      duration: 200,
    })
  }

  update() {
    const {
      positionTween,
      leftArmPositionTween,
      leftArmTargetOffset,
      rightArmPositionTween,
      rightArmTargetOffset,
      targetX,
      targetY,
      x,
      y,
    } = this

    positionTween.updateTo("x", targetX, true)
    positionTween.updateTo("y", targetY, true)
    positionTween.restart()

    leftArmPositionTween.updateTo("x", leftArmTargetOffset.x, true)
    leftArmPositionTween.updateTo("y", leftArmTargetOffset.y, true)
    leftArmPositionTween.restart()

    rightArmPositionTween.updateTo("x", rightArmTargetOffset.x, true)
    rightArmPositionTween.updateTo("y", rightArmTargetOffset.y, true)
    rightArmPositionTween.restart()
  }

  attackWithLeftArm = true
  attack() {
    if (this.attackWithLeftArm) {
      this.leftArmTargetOffset = { x: 0, y: -70 }
      this.rightArmTargetOffset = { x: -60, y: -10 }

      setTimeout(() => {
        this.leftArmTargetOffset = { x: 50, y: -30 }
        this.rightArmTargetOffset = { x: -50, y: -30 }
      }, 300)
    } else {
      this.rightArmTargetOffset = { x: 0, y: -70 }
      this.leftArmTargetOffset = { x: 60, y: -10 }

      setTimeout(() => {
        this.rightArmTargetOffset = { x: -50, y: -30 }
        this.leftArmTargetOffset = { x: 50, y: -30 }
      }, 300)
    }

    this.attackWithLeftArm = !this.attackWithLeftArm
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
