// src/components/friend/FriendRequestPanel.tsx
"use client";

import React, { useEffect, useState } from "react";
import Avatar from "../common/avatar";
import friendService from "@/service/friendService";

interface FriendRequestResponse {
  id: number;
  sender: {
    id: number;
    displayName: string;
    avatar?: string | null;
  };
  createdAt: string;
}

interface FriendRequestPanelProps {
  onClose: () => void;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

const FriendRequestPanel: React.FC<FriendRequestPanelProps> = ({
  onClose,
  onAccept,
  onDecline,
}) => {
  const [requests, setRequests] = useState<FriendRequestResponse[]>([]);

  useEffect(() => {
    friendService
      .getRequestFriends()
      .then((res) => {
        setRequests(res.data || []);
      })
      .catch((err) => {
        console.error("Lấy lời mời kết bạn thất bại", err);
      });
  }, []);

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* panel */}
      <div className="fixed inset-0 flex items-start justify-center pt-12 z-50">
        <div className="w-[90%] max-w-lg bg-[#1a1d2e] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col max-h-[80vh]">
          
          {/* header */}
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-sm font-semibold text-white">Lời mời kết bạn</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {requests.length} lời mời đang chờ
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* list */}
          <div className="overflow-y-auto divide-y divide-white/5 flex-1">
            {requests.length === 0 ? (
              <div className="py-8 text-center text-slate-600 text-sm">
                Không có lời mời nào
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                >
                  <Avatar name={req.sender.displayName} id={req.sender.id} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {req.sender.displayName}
                    </p>
                    <p className="text-xs text-slate-500">1 bạn chung</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => onAccept(req.id)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Chấp nhận
                    </button>
                    <button
                      onClick={() => onDecline(req.id)}
                      className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.12] text-slate-300 text-xs font-medium rounded-lg transition-colors"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendRequestPanel;