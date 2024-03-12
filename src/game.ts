import { Socket } from "socket.io-client";

import { phaserGameConfig } from "./config/phaserConfig";
import { assets } from "./config/assets";

import { Player } from "./components/Player";
import { GameMap } from "./components/Map";

import { StatsGUI } from "./GUI/StatsGUI";
import { InventoryGUI } from "./GUI/InventoryGUI";
import { CraftingGUI } from "./GUI/CraftingGUI";
import { SocketEvent } from "./enums/socketEvent";

export async function initializeGame(
  socket: Socket,
  username: string,
  spawnX: number,
  spawnY: number
) {
  const nearbyPlayers: Record<string, Player> = {};
  let player: Player;
  let map: GameMap;
  let statsGUI: StatsGUI;
  let inventoryGUI: InventoryGUI;

  new Phaser.Game({
    ...phaserGameConfig,
    scene: { preload, create, update }
  });

  function preload() {
    Object.entries(assets).forEach(([name, asset]) => {
      this.load.image(name, `/assets/images/${asset}`);
    });
  }

  function create() {
    // Create the player
    player = new Player({ scene: this, username, x: spawnX, y: spawnY });
    this.cameras.main.startFollow(player);

    // Create the map
    map = new GameMap().update(player);

    statsGUI = new StatsGUI(this);
    inventoryGUI = new InventoryGUI(this, socket);
    const craftingGUI = new CraftingGUI(this, socket);

    const noClickThroughUIElements = [inventoryGUI, craftingGUI];

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

      const movement = ["w", "s"].includes(e.key) ? [1, y] : [0, x];
      socket.emit(SocketEvent.Move, movement);
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

      const movement = ["w", "s"].includes(e.key) ? [1, y] : [0, x];
      socket.emit(SocketEvent.Move, movement);
    });

    // Rotation
    let rotation = 0;
    let lastRotation = 0;

    window.addEventListener("mousemove", ({ clientX, clientY }) => {
      rotation = Math.atan2(clientX - innerWidth / 2, -(clientY - innerHeight / 2));
      player.setRotation(rotation);
    });

    setInterval(() => {
      if (rotation === lastRotation) return;
      socket.emit(SocketEvent.Rotate, rotation);
      lastRotation = rotation;
    }, 400);

    // Attack
    let isAttacking = false;

    this.input.on("pointerdown", (pointer) => {
      const isClickOnUI = noClickThroughUIElements.some((uiElement) =>
        uiElement.getBounds().contains(pointer.x, pointer.y)
      );
      if (isClickOnUI) return;

      socket.emit(SocketEvent.AttackStart);
      isAttacking = true;
    });

    this.input.on("pointerup", () => {
      if (!isAttacking) return;
      socket.emit(SocketEvent.AttackStop);
      isAttacking = false;
    });

    // Socket listeners
    socket.on(SocketEvent.MovementUpdate, (arrayBuffer) => {
      const dataView = new DataView(arrayBuffer);
      const x = dataView.getFloat64(0, true);
      const y = dataView.getFloat64(8, true);

      player.targetX = x;
      player.targetY = y;
    });

    socket.on(SocketEvent.MovementUpdateOther, ([id, arrayBuffer]) => {
      if (id in nearbyPlayers) {
        const dataView = new DataView(arrayBuffer);
        const x = dataView.getFloat64(0, true);
        const y = dataView.getFloat64(8, true);

        nearbyPlayers[id].targetX = x;
        nearbyPlayers[id].targetY = y;
      }
    });

    socket.on(SocketEvent.InventoryUpdate, (items) => {
      inventoryGUI.update(items);
      craftingGUI.update(items);
    });

    socket.on(SocketEvent.HelmetUpdate, (item) => {
      player.updateHelmet(item);
    });

    socket.on(SocketEvent.HelmetUpdateOther, ([id, item]) => {
      if (id in nearbyPlayers) nearbyPlayers[id].updateHelmet(item);
    });

    socket.on(SocketEvent.WeaponOrToolUpdate, (item) => {
      player.updateWeaponOrTool(item);
    });

    socket.on(SocketEvent.WeaponOrToolUpdateOther, ([id, item]) => {
      if (id in nearbyPlayers) nearbyPlayers[id].updateWeaponOrTool(item);
    });

    socket.on(SocketEvent.RotateOther, ([id, rotation]) => {
      if (id in nearbyPlayers) {
        nearbyPlayers[id].targetRotation = rotation;
      }
    });

    socket.on(SocketEvent.StatsUpdate, (stats) => {
      statsGUI.updateStats(stats);
    });

    socket.on(SocketEvent.Attack, () => {
      player.playAttackAnimation();
    });

    socket.on(SocketEvent.AttackOther, ([id]) => {
      if (id in nearbyPlayers) nearbyPlayers[id].playAttackAnimation();
    });

    socket.on(SocketEvent.AnimateCollectable, ([id, angle]) => {
      map.resourceAttack(id, angle);
    });

    socket.on(SocketEvent.PlayerInitialization, ([id, username, x, y, angle]) => {
      if (id in nearbyPlayers) return;
      nearbyPlayers[id] = new Player({
        scene: this,
        username,
        x,
        y,
        isOtherPlayer: true
      });
      nearbyPlayers[id].setRotation(angle);
    });

    socket.on(SocketEvent.PlayerRemove, (id) => {
      if (id in nearbyPlayers) {
        nearbyPlayers[id].destroy();
        delete nearbyPlayers[id];
      }
    });
  }

  function update() {
    player.update();
    Object.values(nearbyPlayers).forEach((nearbyPlayer) => nearbyPlayer.update());
    map.update(player);

    statsGUI.update();
    inventoryGUI.sceneUpdate();
  }
}
