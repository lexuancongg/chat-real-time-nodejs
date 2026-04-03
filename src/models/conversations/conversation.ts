
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

export type Status = "ONLINE" | "OFFLINE";

