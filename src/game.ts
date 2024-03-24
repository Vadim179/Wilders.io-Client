import { phaserGameConfig } from "./config/phaserConfig";
import { assets } from "./config/assets";
import { ClientSocketEvent, ServerSocketEvent } from "./enums/socketEvent";

import { Player } from "./components/Player";
import { GameMap } from "./components/Map";

import { StatsGUI } from "./GUI/StatsGUI";
import { InventoryGUI } from "./GUI/InventoryGUI";
import { CraftingGUI } from "./GUI/CraftingGUI";

import { sendBinaryDataToServer } from "./helpers/sendBinaryDataToServer";
import { encodeMovement } from "./helpers/encodeMovement";
import { decodeBinaryDataFromServer } from "./helpers/decodeBinaryDataFromServer";
import { createChatGUI } from "./GUI/ChatGUI";
import { MiniMap } from "./GUI/MiniMapGUI";
import { Mob } from "./components/Mob";
import { toolRangeAndRadiusMap } from "./config/toolRangeAndRadiusMap";

export async function initializeGame(
  socket: WebSocket,
  id: number,
  username: string,
  spawnX: number,
  spawnY: number,
  initialOtherPlayers: any[],
  initialMobs: any[],
) {
  const otherPlayers: Record<string, Player> = {};
  const mobs: Record<string, Mob> = {};

  let player: Player;
  let map: GameMap;
  let statsGUI: StatsGUI;
  let inventoryGUI: InventoryGUI;
  let miniMap: MiniMap;

  new Phaser.Game({
    ...phaserGameConfig,
    scene: { preload, create, update },
  });

  function preload() {
    Object.entries(assets).forEach(([name, asset]) => {
      this.load.image(name, `/assets/images/${asset}`);
    });
  }

  function create() {
    // Create the player
    player = new Player({ id, scene: this, username, x: spawnX, y: spawnY });
    this.cameras.main.startFollow(player);

    // Create the map
    map = new GameMap().update(player);

    statsGUI = new StatsGUI(this);
    inventoryGUI = new InventoryGUI(this, socket);
    miniMap = new MiniMap(
      this,
      phaserGameConfig.canvas.width,
      phaserGameConfig.canvas.height,
    );
    const craftingGUI = new CraftingGUI(this, socket);
    const noClickThroughUIElements = [inventoryGUI, craftingGUI];
    const { chatBox, chatInput } = createChatGUI();

    // Create other players
    initialOtherPlayers.forEach((data) => {
      const [id, username, x, y, angle, weaponOrTool, helmet, ...stats] = data;

      otherPlayers[id] = new Player({
        id,
        scene: this,
        username,
        x,
        y,
        isOtherPlayer: true,
      });

      otherPlayers[id].targetAngle = angle;
      otherPlayers[id]
        .setAngle(angle)
        .updateHelmet(helmet)
        .updateWeaponOrTool(weaponOrTool)
        .updateStats(stats);
    });

    // Create mobs
    initialMobs.forEach((data) => {
      const [mobTag, id, x, y, targetX, targetY, health] = data;
      const mobId = `${mobTag}-${id}`;

      mobs[mobId] = new Mob({
        id,
        scene: this,
        mobTag,
        x,
        y,
        targetX,
        targetY,
        health,
      });
    });

    // Movement
    const keyboardInput = {
      w: false,
      a: false,
      s: false,
      d: false,
    };

    let x = 0;
    let y = 0;
    let isTyping = false;

    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;

      if (isTyping) {
        if (e.key === "Enter") {
          isTyping = false;

          if (chatInput.value) {
            player.createChatBubble(chatInput.value);
            sendBinaryDataToServer(
              socket,
              ClientSocketEvent.Chat,
              chatInput.value,
            );
          }

          chatInput.value = "";
          chatBox.blur();
          chatBox.style.display = "none";
          return;
        }

        return;
      }

      if (e.key === "Enter") {
        isTyping = true;

        if (isTyping) {
          chatBox.style.display = "block";
          chatInput.focus();
        }

        return;
      }

      if (e.key in keyboardInput) keyboardInput[e.key] = true;
      else return;

      if (e.key === "d") x = 1;
      else if (e.key === "a") x = 2;

      if (e.key === "s") y = 1;
      else if (e.key === "w") y = 2;

      sendBinaryDataToServer(
        socket,
        ClientSocketEvent.Move,
        encodeMovement(x, y),
      );
    });

    window.addEventListener("keyup", (e) => {
      if (e.key in keyboardInput) keyboardInput[e.key] = false;
      else return;

      if (e.key === "d" && keyboardInput.a) x = 2;
      else if (e.key === "a" && keyboardInput.d) x = 1;
      else if (["a", "d"].includes(e.key)) x = 0;

      if (e.key === "s" && keyboardInput.w) y = 2;
      else if (e.key === "w" && keyboardInput.s) y = 1;
      else if (["w", "s"].includes(e.key)) y = 0;

      sendBinaryDataToServer(
        socket,
        ClientSocketEvent.Move,
        encodeMovement(x, y),
      );
    });

    // Rotation
    let angle = 0;
    let lastAngle = 0;

    window.addEventListener("mousemove", ({ clientX, clientY }) => {
      angle = Number(
        (
          Math.atan2(clientX - innerWidth / 2, -(clientY - innerHeight / 2)) *
          (180 / Math.PI)
        ).toFixed(0),
      );

      player.setAngle(angle);
    });

    setInterval(() => {
      if (angle === lastAngle) return;
      sendBinaryDataToServer(socket, ClientSocketEvent.Rotate, angle);
      lastAngle = angle;
    }, 300);

    // Attack
    let isAttacking = false;
    function attack(otherPlayerId?: number) {
      const attackingPlayer =
        typeof otherPlayerId === "undefined"
          ? player
          : otherPlayers[otherPlayerId];

      const attackDistance = attackingPlayer.weaponOrTool
        ? toolRangeAndRadiusMap[attackingPlayer.weaponOrToolItem].toolRange
        : 40;
      const attackRadius = attackingPlayer.weaponOrTool
        ? toolRangeAndRadiusMap[attackingPlayer.weaponOrToolItem].toolRadius
        : 40;
      const angle = attackingPlayer.rotation - (90 * Math.PI) / 180;

      const attackPosition = {
        x: attackingPlayer.x + Math.cos(angle) * attackDistance,
        y: attackingPlayer.y + Math.sin(angle) * attackDistance,
      };

      const entities = map.getEntitiesInRange(attackPosition, attackRadius);
      entities.forEach((body) => map.resourceAttack(body.id, angle));
      attackingPlayer.playAttackAnimation();
    }

    this.input.on("pointerdown", (pointer) => {
      const isClickOnUI = noClickThroughUIElements.some((uiElement) =>
        uiElement.getBounds().contains(pointer.x, pointer.y),
      );
      if (isClickOnUI) return;

      sendBinaryDataToServer(socket, ClientSocketEvent.AttackStart);
      isAttacking = true;
    });

    this.input.on("pointerup", () => {
      if (!isAttacking) return;
      sendBinaryDataToServer(socket, ClientSocketEvent.AttackStop);
      isAttacking = false;
    });

    // Socket listeners
    socket.onmessage = (event) => {
      const [eventName, data] = decodeBinaryDataFromServer(event.data);

      switch (eventName) {
        case ServerSocketEvent.Tick: {
          let playerPayload = [];
          let mobPayload = [];

          if (data.length === 2) {
            playerPayload = data[0];
            mobPayload = data[1];
          } else {
            playerPayload = data;
          }

          const playerChunkSize = 9;

          const playerDataChunks = playerPayload.reduce(
            (acc, _, i) =>
              i % playerChunkSize
                ? acc
                : [...acc, playerPayload.slice(i, i + playerChunkSize)],
            [],
          );

          playerDataChunks.forEach((playerPayload) => {
            const [thisId, x, y, angle, weaponOrTool, helmet, ...stats] =
              playerPayload;

            let thisPlayer: Player | null = null;

            if (thisId in otherPlayers) {
              thisPlayer = otherPlayers[thisId];
            } else if (thisId === id) {
              thisPlayer = player;
            }

            if (thisPlayer) {
              thisPlayer.targetX = x;
              thisPlayer.targetY = y;
              thisPlayer.targetAngle = angle;

              if (weaponOrTool !== thisPlayer.weaponOrToolItem)
                thisPlayer.updateWeaponOrTool(weaponOrTool);
              if (helmet !== thisPlayer.helmetItem)
                thisPlayer.updateHelmet(helmet);

              thisPlayer.updateStats(stats);
              if (thisPlayer === player) statsGUI.updateStats(stats);
            }
          });

          const mobChunkSize = 5;

          const mobDataChunks = mobPayload.reduce(
            (acc, _, i) =>
              i % mobChunkSize
                ? acc
                : [...acc, mobPayload.slice(i, i + mobChunkSize)],
            [],
          );

          mobDataChunks.forEach((mobPayload) => {
            const [mobTag, id, targetX, targetY, health] = mobPayload;
            const mobId = `${mobTag}-${id}`;

            if (mobId in mobs) {
              const mob = mobs[mobId];

              mob.targetX = targetX;
              mob.targetY = targetY;

              mob.updateHealth(health);
              mob.healthBar.update();

              if (
                Math.abs(Math.floor(mob.x) - targetX) > 1 ||
                Math.abs(Math.floor(mob.y) - targetY) > 1
              ) {
                const targetAngle =
                  Math.atan2(targetY - mob.y, targetX - mob.x) *
                    (180 / Math.PI) -
                  90;
                mob.targetAngle = targetAngle;
              }
            }
          });

          break;
        }
        case ServerSocketEvent.Attack:
          attack();
          break;
        case ServerSocketEvent.AttackOther: {
          attack(data);
          break;
        }
        case ServerSocketEvent.InventoryUpdate:
          inventoryGUI.update(data);
          craftingGUI.update(data);
          break;
        case ServerSocketEvent.PlayerInitialization: {
          const [id, username, x, y, angle] = data;

          otherPlayers[id] = new Player({
            id,
            scene: this,
            username,
            x,
            y,
            isOtherPlayer: true,
          });

          otherPlayers[id].setAngle(angle);
          break;
        }
        case ServerSocketEvent.PlayerRemove: {
          const id = data;
          if (id in otherPlayers) {
            otherPlayers[id].destroy();
            delete otherPlayers[id];
          }
          break;
        }
        case ServerSocketEvent.MobInitialization: {
          const [mobTag, id, x, y] = data;
          const mobId = `${mobTag}-${id}`;

          mobs[mobId] = new Mob({
            id,
            scene: this,
            mobTag,
            x,
            y,
            targetX: x,
            targetY: y,
          });
          break;
        }
        case ServerSocketEvent.MobRemove: {
          const [mobTag, id] = data;
          const mobId = `${mobTag}-${id}`;

          if (mobId in mobs) {
            mobs[mobId].destroy();
            delete mobs[mobId];
          }
          break;
        }
        case ServerSocketEvent.Chat: {
          const [id, message] = data;
          if (id in otherPlayers) otherPlayers[id].createChatBubble(message);
          break;
        }
      }
    };
  }

  function update() {
    player.update();
    Object.values(otherPlayers).forEach((nearbyPlayer) =>
      nearbyPlayer.update(),
    );
    Object.values(mobs).forEach((mob) => mob.update());
    map.update(player);
    miniMap.updateMiniMap({ x: player.x, y: player.y });
    statsGUI.update();
    inventoryGUI.sceneUpdate();
  }
}
