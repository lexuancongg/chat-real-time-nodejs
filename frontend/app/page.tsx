"use client";

import Avatar from "@/components/common/avatar";
import UserSearchItem from "@/components/common/userSearchItem";
import FriendRequestPanel from "@/components/friends/friendRequestPanel";
import { WsEvent, WsEventType } from "@/models/event/event";
import { WSMessagePayload } from "@/models/message/message";
import { Status, UserSearchResult } from "@/models/users/user";
import { useSocket } from "@/provider/socketProvider";
import conversationService from "@/service/conversationService";
import { formatTime } from "@/utils/time/time";
import { useCallback, useEffect, useRef, useState } from "react";




export type Conversation = {
  id: number;
  isGroup: boolean;
  name: string;
  avatarUrl: string | null;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  status: Status | null;
};

export type Message = {
  id: number;
  senderId: number;
  content: string;
  createdAt: Date;
  status: "SENT" | "DELIVERED" | "SEEN";
};

export type FriendRequest = {
  id: number;
  name: string;
  mutualFriends: number;
};


export type Me = {
  id: number;
  displayName: string;
  avatarUrl: string | null;
};


const ME: Me = { id: 1, displayName: "Lê xuân công", avatarUrl: null };









export default function HomePage() {

 const context = useSocket();
if (!context) return; 

const { socket,pendingFriendCount, setPendingFriendCount } = context;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [activeId, setActiveId] = useState<number | null>(null);







  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [friendRequests, setFriendRequests] = useState<FriendRequestResponse[]>([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);

  const active = conversations.find((c) => c.id === activeId) ?? null;



  const conversationsToShow: Conversation[] =
    keyword.trim().length > 0
      ? searchResults.map((u) => ({
        id: Number(u.id),
        isGroup: false,
        name: u.displayName ?? "Người dùng",
        avatarUrl: u.avatarUrl,
        lastMessage: "",
        lastMessageTime: new Date(),
        unread: 0,
        status: u.status,
      }))
      : conversations;



  const searchUser = useCallback(async () => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setLoadingSearch(true);
      const res = await fetch(
        `http://localhost:8000/users/search?phone=${keyword}`
      );
      const data = await res.json();
      if (data.success && data.data) {
        setSearchResults([data.data]);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSearch(false);
    }
  }, [keyword]);

  useEffect(() => {
    searchUser();
  }, [searchUser]);

  function sendMessage() {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        senderId: ME.id,
        content: input.trim(),
        createdAt: new Date(),
        status: "SENT",
      },
    ]);
    setInput("");
  }

  function handleAccept(id: number) {
    setFriendRequests((prev) => prev.filter((r) => r.id !== id));
  }

  function handleDecline(id: number) {
    setFriendRequests((prev) => prev.filter((r) => r.id !== id));
  }


  const handleAddFriend = (recipientId:number)=>{
      if (!socket || socket.readyState !== WebSocket.OPEN) {
         console.log("Socket chưa sẵn sàng");
         return;
      }
     const message: WsEvent<WSMessagePayload> ={
      type:WsEventType.NEW_ADD_FRIEND,
      data:{
        type:"TEXT",
        recipientId:recipientId
      }
     }
  
   socket.send(JSON.stringify(message));
  
  }


  const handleChooseUser = (userId:number) =>{
    conversationService.getOrCreateConversationByUserId(userId)
    .then((res)=>{
      const conversationId = res.data;
      if(!conversationId) return;
      setActiveId(res.data)

    })
    .catch((error)=>{
      console.log(error)
    })
  }


  
  return (
    <div className="h-screen bg-[#0f1117] flex overflow-hidden">

      <aside
        className={`${sidebarOpen ? "w-72" : "w-0"
          } flex-shrink-0 transition-all duration-300 overflow-hidden flex flex-col border-r border-white/5 bg-[#13151f]`}
      >
        {/* Header */}
        <div className="px-4 pt-5 pb-3 flex-shrink-0 relative">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-white">Tin nhắn</h1>
            <div className="flex items-center gap-1">

              <div className="relative">
                <button
                  onClick={() => setShowFriendRequests((v) => !v)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${showFriendRequests
                      ? "bg-indigo-600/20 text-indigo-400"
                      : "hover:bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  title="Lời mời kết bạn"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </button>
                {pendingFriendCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none pointer-events-none select-none">
                    {pendingFriendCount > 9 ? "9+" : pendingFriendCount}
                  </span>
                )}
              </div>

              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
          </div>

          {showFriendRequests && (
            <FriendRequestPanel
              requests={friendRequests}
              onClose={() => setShowFriendRequests(false)}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          )}

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            {loadingSearch && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
            )}
            <input
              onChange={(e) => {
                const value = e.target.value;
                if (searchTimeoutRef.current)
                  clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = setTimeout(() => {
                  setKeyword(value);
                }, 500);
              }}
              placeholder="Tìm kiếm..."
              className="w-full bg-[#0f1117] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 scrollbar-thin">
          {conversationsToShow.length === 0 && (
            <p className="text-center text-slate-600 text-xs py-8">
              {keyword.trim() ? "Không tìm thấy người dùng" : "Chưa có cuộc trò chuyện nào"}
            </p>
          )}
          {conversationsToShow.map((conv) => (
            <div key={conv.id} className="relative">a
              <button
                onClick={() => setActiveId(conv.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group ${activeId === conv.id
                    ? "bg-indigo-600/15 border border-indigo-500/20"
                    : "hover:bg-white/[0.04] border border-transparent"
                  }`}
              >
                <Avatar
                  name={conv.name}
                  id={conv.id}
                  showStatus={!conv.isGroup}
                  status={conv.status}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium truncate ${activeId === conv.id ? "text-white" : "text-slate-200"
                        }`}
                    >
                      {conv.name}
                    </span>
                    <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="ml-2 flex-shrink-0 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {conv.unread > 9 ? "9+" : conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>

              <button
                className="absolute right-2 top-2 bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600"
                onClick={(event)=> handleAddFriend(conv.id)}
              >
                Kết bạn
              </button>
            </div>
          ))}
        </div> */}
        <UserSearchItem onAddFriend={handleAddFriend}
        users={searchResults}
        onChooseUser={handleChooseUser}
        >

        </UserSearchItem>

        <div className="px-4 py-3 border-t border-white/5 flex items-center gap-3 flex-shrink-0">
          <Avatar name={ME.displayName} id={ME.id} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {ME.displayName}
            </p>
            <p className="text-xs text-emerald-400">Đang hoạt động</p>
          </div>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
          </button>
        </div>
      </aside>



      <main className="flex-1 flex flex-col min-w-0">
        {active ? (
          <>
            {/* Chat Header */}
            <div className="h-14 flex-shrink-0 flex items-center gap-3 px-4 border-b border-white/5 bg-[#13151f]/50 backdrop-blur-sm">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <Avatar
                name={active.name}
                id={active.id}
                size="sm"
                showStatus={!active.isGroup}
                status={active.status}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{active.name}</p>
                <p
                  className={`text-xs ${active.status === "ONLINE"
                      ? "text-emerald-400"
                      : "text-slate-500"
                    }`}
                >
                  {active.isGroup
                    ? "Nhóm"
                    : active.status === "ONLINE"
                      ? "Đang hoạt động"
                      : "Ngoại tuyến"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {[
                  { icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.11 1.4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" },
                  { icon: "M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" },
                  { icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
                ].map((btn, i) => (
                  <button
                    key={i}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={btn.icon} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-slate-600 text-xs">
                  Bắt đầu cuộc trò chuyện
                </p>
              )}
              {messages.map((msg) => {
                const isMe = msg.senderId === ME.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"
                      }`}
                  >
                    {!isMe && (
                      <Avatar name={active.name} id={active.id} size="sm" />
                    )}
                    <div className="max-w-[65%]">
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe
                            ? "bg-indigo-600 text-white rounded-br-sm"
                            : "bg-[#1e2130] text-slate-200 rounded-bl-sm border border-white/5"
                          }`}
                      >
                        {msg.content}
                      </div>
                      <div
                        className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"
                          }`}
                      >
                        <span className="text-xs text-slate-600">
                          {formatTime(msg.createdAt)}
                        </span>
                        {isMe && (
                          <span className="text-xs text-slate-600">
                            {msg.status === "SEEN"
                              ? "✓✓"
                              : msg.status === "DELIVERED"
                                ? "✓✓"
                                : "✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-4 py-4 border-t border-white/5">
              <div className="flex items-center gap-3 bg-[#1a1d27] border border-white/[0.08] rounded-2xl px-4 py-2.5">
                <button className="text-slate-500 hover:text-indigo-400 transition-colors flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                  </svg>
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && sendMessage()
                  }
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none"
                />
                <button className="text-slate-500 hover:text-indigo-400 transition-colors flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-8 h-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" />
                </svg>
              </div>
              <p className="text-sm text-slate-600">
                Chọn cuộc trò chuyện để bắt đầu
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
