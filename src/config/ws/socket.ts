import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

const configWebsocket = (server: http.Server) => {
  const clients = new Map<string, WebSocket>();
  const rooms = new Map<string, Set<string>>();

  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const url = new URL(req.url!, 'http://localhost');
    const userId = url.searchParams.get('userId')!;

    clients.set(userId, ws);

    ws.on('message', (data: WebSocket.RawData) => {
      console.log('Received:', data.toString());
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