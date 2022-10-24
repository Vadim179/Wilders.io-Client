import { Socket } from "socket.io-client"
import { PhaserGameConfig, Assets, Map } from "./config"
import { EntityFactory } from "./Entities"

export async function initializeGame(
  username: string,
  spawnX: number,
  spawnY: number,
  socket: Socket,
) {
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
    Map.entities.forEach(({ id, x, y }) => {
      EntityFactory[id]({ scene: this, x, y })
    })

    wilder = EntityFactory.Wilder({ scene: this, username, x: spawnX, y: spawnY })
    this.cameras.main.startFollow(wilder, false)

    // this.cameras.main.startFollow(wilder, false)

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

    window.addEventListener("mousedown", () => {
      socket.emit("a", true)
    })

    window.addEventListener("mouseup", () => {
      socket.emit("a", false)
    })

    // Rotation
    let rotation = 0
    let _previousRotation = 0

    window.addEventListener("mousemove", ({ clientX, clientY }) => {
      rotation = Math.atan2(clientX - innerWidth / 2, -(clientY - innerHeight / 2))
      wilder.setRotation(rotation)
    })

    setInterval(() => {
      if (_previousRotation === rotation) return
      socket.emit("r", rotation)
      _previousRotation = rotation
    }, 200)

    socket.on("a", () => {
      console.log("GOT HERE")
      wilder.attack()
    })

    socket.on("d", ({ x, y, r }) => {
      wilder.targetX = x
      wilder.targetY = y
    })
  }

  function update() {
    if (wilder) wilder.update()
  }
}
