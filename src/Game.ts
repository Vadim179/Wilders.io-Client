import { Socket } from "socket.io-client"
import { PhaserGameConfig, Assets, Map } from "./config"
import { EntityFactory } from "./Entities"

export async function initializeGame(username: string, socket: Socket) {
  new Phaser.Game({
    ...PhaserGameConfig,
    scene: { preload, create, update },
  })

  function preload() {
    Assets.forEach(({ id, asset }) => {
      this.load.image(id, `/assets/images/${asset}`)
    })
  }

  let wilder: ReturnType<typeof EntityFactory.Wilder> | null = null

  function create() {
    Map.environment.forEach(({ type, x, y }) => {
      EntityFactory[type]({ scene: this, x, y })
    })

    wilder = EntityFactory.Wilder({ scene: this, username, x: 0, y: 0 })
    this.cameras.main.startFollow(wilder, true)

    // Movement
    const keyboardInput = {
      w: false,
      a: false,
      s: false,
      d: false,
    }

    let x = 0
    let y = 0

    window.addEventListener("keydown", (e) => {
      if (e.repeat) return

      if (e.key in keyboardInput) keyboardInput[e.key] = true
      else return

      if (e.key === "d") x = 1
      else if (e.key === "a") x = -1

      if (e.key === "s") y = 1
      else if (e.key === "w") y = -1

      const movement = ["w", "s"].includes(e.key) ? ["v", y] : ["h", x]
      socket.emit("m", movement)
    })

    window.addEventListener("keyup", (e) => {
      if (e.key in keyboardInput) keyboardInput[e.key] = false
      else return

      if (e.key === "d" && keyboardInput.a) x = -1
      else if (e.key === "a" && keyboardInput.d) x = 1
      else if (["a", "d"].includes(e.key)) x = 0

      if (e.key === "s" && keyboardInput.w) y = -1
      else if (e.key === "w" && keyboardInput.s) y = 1
      else if (["w", "s"].includes(e.key)) y = 0

      const movement = ["w", "s"].includes(e.key) ? ["v", y] : ["h", x]
      socket.emit("m", movement)
    })

    // Attack
    let attacking = false

    window.addEventListener("mousedown", () => {
      attacking = true
      socket.emit("a", attacking)
    })

    window.addEventListener("mouseup", () => {
      attacking = false
      socket.emit("a", attacking)
    })

    // Rotation
    let rotation = 0

    window.addEventListener("mousemove", ({ clientX, clientY }) => {
      const wilderX = innerWidth / 2
      const wilderY = innerHeight / 2

      rotation = Math.atan2(clientX - wilderX, -(clientY - wilderY))
      wilder.setRotation(rotation)

      socket.emit("r", rotation)
    })
  }

  function update() {
    if (wilder) wilder.update()
  }
}
