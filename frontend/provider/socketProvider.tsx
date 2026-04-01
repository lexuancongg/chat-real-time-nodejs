"use client";

import { createContext, useContext, useEffect, useState } from "react";

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