import * as MsgPack from "msgpack-lite";
import { SocketEvent } from "../enums/socketEvent";

export function sendBinaryDataToServer(
  ws: WebSocket,
  event: SocketEvent,
  data?: any
) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error("WebSocket is not open.");
    return;
  }

  const messageObject = [event];
  if (data !== undefined) messageObject.push(data);
  const message = MsgPack.encode(messageObject);

  ws.send(message);
}
