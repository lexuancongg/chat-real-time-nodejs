type MessageType = "TEXT" | "IMAGE" | "FILE" | "VIDEO";

type MessageStatus = "SENT" | "DELIVERED" | "SEEN";

type Sender = {
  id: string;
  displayName: string;
  avatar?: string;
};

type MessagePayload = {
  id: string;
  conversationId: string;
  sender: Sender;
  content: string;
  type: MessageType;
  status: MessageStatus;
  createdAt: string; 
};