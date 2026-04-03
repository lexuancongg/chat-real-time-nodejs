import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import cookie, { Cookies } from "cookie";
import signature from "cookie-signature";
import { sessionStore } from '../../middlewares/session';
import prisma from '../../../prisma/client';
import { WsEvent, WsEventType, WsResponse } from '../../models/event/event';
import { WSMessagePayload } from '../../models/ws/wsPayload';

const configWebsocket = (server: http.Server) => {
  const clients = new Map<number, WebSocket>();
  const rooms = new Map<number, Set<number>>();

  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const cookies: Cookies = cookie.parse(req.headers.cookie || "");
    const rawSid = cookies["connect.sid"];
    if (!rawSid) return ws.close();

    let sessionId = rawSid.startsWith("s:")
      ? signature.unsign(rawSid.slice(2), "ABCDIIKWUEJBUENLKUIESFJJBSNCJSJSJB")
      : rawSid;

    if (!sessionId) return ws.close();

    sessionStore.get(sessionId, async (err, session) => {
      if (err || !session?.user) return ws.close();

      const userId = Number(session.user.id); // đảm bảo number
      clients.set(userId, ws);

      const memberships = await prisma.conversationMember.findMany({
        where: { userId }, // number thôi
        select: { conversationId: true },
      });

      memberships.forEach(({ conversationId }) => {
        const roomId = Number(conversationId);
        if (!rooms.has(roomId)) rooms.set(roomId, new Set());
        rooms.get(roomId)!.add(userId);
      });
    });

    ws.on('message', async (raw: WebSocket.RawData) => {
      try {
        const message: WsEvent<WSMessagePayload> = JSON.parse(raw.toString());

        switch (message.type) {
          case WsEventType.NEW_MESSAGE: {
            const data: WSMessagePayload = message.data;
            const conversationId = Number(data.conversationId);
            const userIds = rooms.get(conversationId);
            if (!userIds) return;

            userIds.forEach((uid) => {
              const client = clients.get(uid);
              if (client?.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "NEW_MESSAGE", data }));
              }
            });
            break;
          }

          case WsEventType.NEW_ADD_FRIEND: {
            const data: WSMessagePayload = message.data;
            const recipientId = Number(data.recipientId);
            const senderId = [...clients.entries()].find(([uid, socket]) => socket === ws)?.[0];
            if (!senderId) return;

            const sender = await prisma.user.findUnique({
              where: { id: senderId }, // number
              select: { displayName: true, avatar: true, id: true }
            });
            if (!sender) return;

            const existingRequest = await prisma.friendRequest.findUnique({
              where: { senderId_receiverId: { senderId, receiverId: recipientId } } // number
            });

            if (!existingRequest) {
              await prisma.friendRequest.create({
                data: { senderId, receiverId: recipientId, status: "PENDING" }
              });
            }

            const client = clients.get(recipientId);
            if (client?.readyState === WebSocket.OPEN) {
              const wsResponse: WsResponse<NewRequestFriendResponsePayload> = {
                type: WsEventType.NEW_REQUEST_FRIEND,
                payload: {
                  message: "yêu cầu kết bạn",
                  sender: {
                    displayName: sender.displayName!,
                    id: sender.id.toString()
                  }
                }
              }
              client.send(JSON.stringify(wsResponse));
            }
            break;
          }
        }
      } catch (err) {
        console.error("Invalid message:", err);
      }
    });

    ws.on('error', () => {});
    ws.on('close', () => {});
  });

  wss.on('error', () => {});
};

export default configWebsocket;