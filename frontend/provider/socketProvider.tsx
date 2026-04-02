"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SocketContext = createContext<WebSocket | null>(null);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      console.log("WS connected");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("WS disconnected");
      setSocket(null);
    };

     ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "NEW_FRIEND":
          toast(`Bạn có người thêm bạn: ${message.payload.message}`);
          break;

        case "NEW_MESSAGE":
          // xử lý message tương tự
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}