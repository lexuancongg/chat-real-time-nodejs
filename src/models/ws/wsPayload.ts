type MessageType = "TEXT" | "IMAGE" | "FILE" | "VIDEO";

type MessageStatus = "SENT" | "DELIVERED" | "SEEN";

type Sender = {
  id: number;
  displayName: string;
  avatar?: string;
};

export type WSMessagePayload = {
  id?: number;
  type?: "TEXT" | "IMAGE" | "FILE" | "VIDEO" | "FRIEND_REQUEST"; 
  conversationId?: number;    
  sender?: Sender;
  recipientId?: number;       
  content?: string;           
  status?: MessageStatus;     
  createdAt: string;
};




export type NewRequestFriendResponsePayload = {
  message: string;    
  sender: Sender;     
  requestId?: string; 
};