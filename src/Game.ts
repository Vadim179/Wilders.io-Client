import { Socket } from "socket.io-client";
import { PhaserGameConfig, Assets, MapEntities } from "./config";
import { GameMap } from "./Map";
import { Player } from "./Player";

export async function initializeGame(
  socket: Socket,
  username: string,
  spawnX: number,
  spawnY: number
) {
  let player: Player;
  let map: GameMap;

  new Phaser.Game({
    ...PhaserGameConfig,
    scene: { preload, create, update }
  });

  function preload() {
    Assets.forEach(({ id, asset }) => {
      this.load.image(id, `/assets/images/${asset}`);
    });
  }

  function create() {
    // Create the player
    player = new Player({ scene: this, username, x: spawnX, y: spawnY });
    this.cameras.main.startFollow(player, false);

    // reorder scene sprites by depth
    console.log(player, this.children.list, this.children);

    // Create the map
    map = new GameMap().update(player);

    // Movement
    const keyboardInput = {
      w: false,
      a: false,
      s: false,
      d: false
    };

    let x = 0;
    let y = 0;

    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;

      if (e.key in keyboardInput) keyboardInput[e.key] = true;
      else return;

      if (e.key === "d") x = 1;
      else if (e.key === "a") x = -1;

      if (e.key === "s") y = 1;
      else if (e.key === "w") y = -1;

      const movement = ["w", "s"].includes(e.key) ? ["y", y] : ["x", x];
      socket.emit("move", movement);
    });

    window.addEventListener("keyup", (e) => {
      if (e.key in keyboardInput) keyboardInput[e.key] = false;
      else return;

      if (e.key === "d" && keyboardInput.a) x = -1;
      else if (e.key === "a" && keyboardInput.d) x = 1;
      else if (["a", "d"].includes(e.key)) x = 0;

      if (e.key === "s" && keyboardInput.w) y = -1;
      else if (e.key === "w" && keyboardInput.s) y = 1;
      else if (["w", "s"].includes(e.key)) y = 0;

      const movement = ["w", "s"].includes(e.key) ? ["y", y] : ["x", x];
      socket.emit("move", movement);
    });

    // Attack
    // window.addEventListener("mousedown", () => {
    //   socket.emit("attack", true);
    // });

    // window.addEventListener("mouseup", () => {
    //   socket.emit("attack", false);
    // });

    // Rotation
    let rotation = 0;

    window.addEventListener("mousemove", ({ clientX, clientY }) => {
      rotation = Math.atan2(clientX - innerWidth / 2, -(clientY - innerHeight / 2));
      player.setRotation(rotation);
      socket.emit("rotate", rotation);
    });

    // Socket listeners
    socket.on("update", ([{ x, y }]) => {
      player.x = x;
      player.y = y;
    });
  }

  function update() {
    if (player) {
      player.update();
      map.update(player);
    }
  }
}
