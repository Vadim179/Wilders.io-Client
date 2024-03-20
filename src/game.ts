import { phaserGameConfig } from "./config/phaserConfig";
import { assets } from "./config/assets";
import { SocketEvent } from "./enums/socketEvent";

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

export async function initializeGame(
  socket: WebSocket,
  id: number,
  username: string,
  spawnX: number,
  spawnY: number,
  otherPlayers: any[],
) {
  const nearbyPlayers: Record<string, Player> = {};

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
    otherPlayers.forEach(([id, username, x, y, angle]) => {
      nearbyPlayers[id] = new Player({
        id,
        scene: this,
        username,
        x,
        y,
        isOtherPlayer: true,
      });
      nearbyPlayers[id].setRotation(angle);
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
            sendBinaryDataToServer(socket, SocketEvent.Chat, chatInput.value);
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

      sendBinaryDataToServer(socket, SocketEvent.Move, encodeMovement(x, y));
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

      sendBinaryDataToServer(socket, SocketEvent.Move, encodeMovement(x, y));
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
      sendBinaryDataToServer(socket, SocketEvent.Rotate, angle);
      lastAngle = angle;
    }, 300);

    // Attack
    let isAttacking = false;
    function attack(otherPlayerId?: number) {
      const attackingPlayer = otherPlayerId
        ? nearbyPlayers[otherPlayerId]
        : player;

      const attackDistance = attackingPlayer.weaponOrTool ? 60 : 40;
      const attackRadius = attackingPlayer.weaponOrTool ? 50 : 40;
      const angle = attackingPlayer.rotation - (90 * Math.PI) / 180;

      const attackPosition = {
        x: attackingPlayer.x + Math.cos(angle) * attackDistance,
        y: attackingPlayer.y + Math.sin(angle) * attackDistance,
      };

      const entities = map.getEntitiesInRange(attackPosition, attackRadius);
      const players = map.getPlayersInRange(attackPosition, attackRadius, {
        ...nearbyPlayers,
        [id]: player,
      });

      players.forEach((targetPlayer) => {
        if (targetPlayer !== attackingPlayer) {
          targetPlayer.playDamageAnimation();
        }
      });

      entities.forEach((body) => map.resourceAttack(body.id, angle));
      attackingPlayer.playAttackAnimation();
    }

    this.input.on("pointerdown", (pointer) => {
      const isClickOnUI = noClickThroughUIElements.some((uiElement) =>
        uiElement.getBounds().contains(pointer.x, pointer.y),
      );
      if (isClickOnUI) return;

      sendBinaryDataToServer(socket, SocketEvent.AttackStart);
      isAttacking = true;
    });

    this.input.on("pointerup", () => {
      if (!isAttacking) return;
      sendBinaryDataToServer(socket, SocketEvent.AttackStop);
      isAttacking = false;
    });

    // Socket listeners
    socket.onmessage = (event) => {
      const [eventName, data] = decodeBinaryDataFromServer(event.data);

      switch (eventName) {
        case SocketEvent.Tick: {
          data.forEach((playerPayload) => {
            let thisPlayer: Player | null = null;

            if (playerPayload.i in nearbyPlayers) {
              thisPlayer = nearbyPlayers[playerPayload.i];
            } else if (playerPayload.i === id) {
              thisPlayer = player;
            }

            if (thisPlayer) {
              if ("x" in playerPayload) thisPlayer.targetX = playerPayload.x;
              if ("y" in playerPayload) thisPlayer.targetY = playerPayload.y;
              if ("a" in playerPayload)
                thisPlayer.targetAngle = playerPayload.a;

              if ("b" in playerPayload)
                thisPlayer.updateWeaponOrTool(playerPayload.b);
              if ("c" in playerPayload)
                thisPlayer.updateHelmet(playerPayload.c);

              if (thisPlayer === player) {
                const stats = [
                  playerPayload.d,
                  playerPayload.e,
                  playerPayload.f,
                ];

                statsGUI.updateStats(stats);
              }
            }
          });
          break;
        }
        case SocketEvent.Attack: {
          attack(data);
          break;
        }
        case SocketEvent.InventoryUpdate:
          inventoryGUI.update(data);
          craftingGUI.update(data);
          break;
        case SocketEvent.PlayerInitialization: {
          const [id, username, x, y, angle] = data;

          nearbyPlayers[id] = new Player({
            id,
            scene: this,
            username,
            x,
            y,
            isOtherPlayer: true,
          });

          nearbyPlayers[id].setAngle(angle);
          break;
        }
        case SocketEvent.PlayerRemove: {
          const id = data;
          if (id in nearbyPlayers) {
            nearbyPlayers[id].destroy();
            delete nearbyPlayers[id];
          }
          break;
        }
        case SocketEvent.AttackOther: {
          attack(data);
          break;
        }
        case SocketEvent.Chat: {
          const [id, message] = data;
          if (id in nearbyPlayers) nearbyPlayers[id].createChatBubble(message);
          break;
        }
      }
    };
  }

  function update() {
    player.update();
    Object.values(nearbyPlayers).forEach((nearbyPlayer) =>
      nearbyPlayer.update(),
    );
    map.update(player);
    miniMap.updateMiniMap({ x: player.x, y: player.y });
    statsGUI.update();
    inventoryGUI.sceneUpdate();
  }
}
