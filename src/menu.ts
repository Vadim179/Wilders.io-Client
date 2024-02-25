import { io, Socket } from "socket.io-client";
import { initializeGame } from "./game";

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
const notification = <HTMLElement>document.querySelector(".main-menu__notification");
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

  let socket: Socket;

  playButton.addEventListener("click", () => {
    clearNotification();
    setMenuLoading(true);

    if (socket) {
      socket.disconnect();
      socket = null;
    }

    if (username === "") username = "unnamed#" + Math.floor(Math.random() * 9999);
    else if (username.length > 16) username = username.slice(0, 16);

    socket = io("http://localhost:8000", {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 3000,
      query: { username }
    });

    socket.io.on("reconnect_failed", () => {
      setMenuLoading(false);
      showNotification("Couldn't connect to this server");
      playButton.removeAttribute("disabled");
    });

    socket.once("init", ({ x, y }) => {
      hideMenu();
      initializeGame(socket, username, x, y);
    });
  });
}
