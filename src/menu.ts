import { initializeGame } from "./game";
import { SocketEvent } from "./enums/socketEvent";
import { decodeBinaryDataFromServer } from "./helpers/decodeBinaryDataFromServer";
import { spawners } from "./config/map";
import { sendBinaryDataToServer } from "./helpers/sendBinaryDataToServer";

const menu = <HTMLElement>document.querySelector(".main-menu");
const usernameInput = <HTMLElement>(
  document.querySelector(".main-menu__controls__input")
);
const serverSelect = <HTMLElement>(
  document.querySelector(".main-menu__controls__server-select")
);
const playButton = <HTMLElement>(
  document.querySelector(".main-menu__controls__play-button")
);
const notification = <HTMLElement>(
  document.querySelector(".main-menu__notification")
);
const loader = <HTMLElement>document.querySelector(".main-menu__loader");

export function showMenu() {
  menu.style.display = "flex";
}

export function hideMenu() {
  menu.style.display = "none";
}

function setMenuLoading(loading = true) {
  if (loading) {
    loader.style.display = "block";
    playButton.textContent = "Loading";
    playButton.setAttribute("disabled", "true");
    return;
  }

  loader.style.display = "none";
  playButton.textContent = "Play";
  playButton.removeAttribute("disabled");
}

function showNotification(message: string, time = 10000) {
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(clearNotification, time);
}

function clearNotification() {
  notification.textContent = "";
  notification.style.display = "none";
}

export function initializeMainMenu() {
  let username = "";

  usernameInput.addEventListener("input", (e) => {
    username = (e.target as HTMLInputElement).value;
  });

  // let server = 'europe'
  serverSelect.addEventListener("change", (e) => {
    // server = e.target.value
  });

  let socket: WebSocket;

  playButton.addEventListener("click", () => {
    clearNotification();
    setMenuLoading(true);

    if (socket) {
      socket.close();
      socket = null;
    }

    if (username === "")
      username = "unnamed#" + Math.floor(Math.random() * 9999);
    else if (username.length > 16) username = username.slice(0, 16);

    // socket = new WebSocket("ws://localhost:8000");
    socket = new WebSocket("ws://172.86.66.19:8000");
    socket.binaryType = "arraybuffer";

    socket.onopen = function () {
      sendBinaryDataToServer(socket, SocketEvent.Join, username);
    };

    socket.onclose = function (event) {
      if (!event.wasClean) {
        setMenuLoading(false);
        showNotification("Couldn't connect to this server");
        playButton.removeAttribute("disabled");
      }
    };

    socket.onmessage = function (event) {
      const [eventName, [spawnerIndex, id, otherPlayers]] =
        decodeBinaryDataFromServer(event.data);

      if (eventName === SocketEvent.Init) {
        socket.onmessage = null;
        const { x, y } = spawners[spawnerIndex];

        hideMenu();
        initializeGame(socket, id, username, x, y, otherPlayers);
      }
    };
  });
}
