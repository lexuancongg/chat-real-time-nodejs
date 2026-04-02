"use client";

import { WsEventType, WsResponse } from "@/models/event/event";
import { NewRequestFriendResponsePayload } from "@/models/message/message";
import friendService from "@/service/friendService";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type SocketContextType = {
  socket: WebSocket | null;
  pendingFriendCount: number;
  setPendingFriendCount: React.Dispatch<React.SetStateAction<number>>;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [pendingFriendCount, setPendingFriendCount] = useState<number>(0);

  useEffect(()=>{
    friendService.getCountRequestFriends()
    .then((res)=>{
      setPendingFriendCount(res.data!)
    })
    .catch((error)=>{
      console.log(error)
    })
  },[])
  


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
      const message: WsResponse = JSON.parse(event.data);

      switch (message.type) {
        case WsEventType.NEW_REQUEST_FRIEND:
          setPendingFriendCount((prev)=> prev+1)
          const payload: NewRequestFriendResponsePayload = message.payload;
          toast.custom((t) => (
            <div
              className={`${t.visible ? "animate-enter" : "animate-leave"
                } max-w-xs w-full bg-white border-l-4 border-indigo-500 shadow-lg rounded-xl p-4 flex gap-3 items-center`}
            >
              {payload.sender.avatar && (
                <img
                  src={payload.sender.avatar}
                  alt={payload.sender.displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-slate-800">
                  {payload.sender.displayName}
                </p>
                <p className="text-slate-500 text-sm">{payload.message}</p>
              </div>
            </div>
          ));
          break;

        case "NEW_MESSAGE":
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
 <SocketContext.Provider value={{ socket, pendingFriendCount, setPendingFriendCount }}>
  {children}
</SocketContext.Provider>
  );
}