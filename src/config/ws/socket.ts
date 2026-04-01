import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import cookie, { Cookies } from "cookie";
import signature from "cookie-signature";
import { sessionStore } from '../../middlewares/session';
import prisma from '../../../prisma/client';

const configWebsocket = (server: http.Server) => {
  const clients = new Map<number, WebSocket>();
  const rooms = new Map<number, Set<number>>();

  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const cookies: Cookies = cookie.parse(req.headers.cookie || "");
    const rawSid = cookies["connect.sid"];
    if (!rawSid) {
      return ws.close();
    }
    let sessionId = rawSid.startsWith("s:")
      ? signature.unsign(rawSid.slice(2), "ABCDIIKWUEJBUENLKUIESFJJBSNCJSJSJB")
      : rawSid;

    if (!sessionId) {
      return ws.close();
    }
    sessionStore.get(sessionId, async (err, session) => {
      if (err || !session?.user) {
        ws.close();
        return;
      }
      const userId = session.user.id;
      clients.set(userId, ws)
      const memberships = await prisma.conversationMember.findMany({
        where: { userId: BigInt(userId) },
        select: { conversationId: true },
      });
      memberships.forEach(({ conversationId }) => {
        const roomId = Number(conversationId);

        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }

        rooms.get(roomId)!.add(userId);
      });

    }
    )



    ws.on('message', async (raw: WebSocket.RawData) => {
      try {
    const message = JSON.parse(raw.toString());

    switch(message.type) {
      case "NEW_MESSAGE": {
        const data = message.data;
        const conversationId = Number(data.conversationId);
        const userIds = rooms.get(conversationId);
        if (!userIds) return;

        userIds.forEach((uid) => {
          const client = clients.get(uid);
          if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: "NEW_MESSAGE",
              data,
            }));
          }
        });
        break;
      }

      case "NEW_FRIEND": {
        console.log("có ng gởi tới server")
        const { from, to } = message.payload;
        const client = clients.get(to);
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "NEW_FRIEND",
            payload: { message:"có ng thêm bạn" },
          }));
        }
        break;
      }
    }
  } catch (err) {
    console.error("Invalid message:", err);
  }
    });



    

    ws.on('error', (err: Error) => {
    });

    ws.on('close', (code: number, reason: Buffer) => {
    });

    ws.send('Welcome bro ');
  });

  wss.on('error', (err: Error) => {
  });
};

export default configWebsocket;