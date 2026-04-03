type MessageType = "TEXT" | "IMAGE" | "FILE" | "VIDEO";

type MessageStatus = "SENT" | "DELIVERED" | "SEEN";

type Sender = {
  id: string;
  displayName: string;
  avatar?: string;
};

export type WSMessagePayload = {
  id?: string;
  type?: "TEXT" | "IMAGE" | "FILE" | "VIDEO" | "FRIEND_REQUEST"; 
  conversationId?: string;    
  sender?: Sender;
  recipientId?: string;       
  content?: string;           
  status?: MessageStatus;     
  createdAt: string;
};




export type NewRequestFriendResponsePayload = {
  message: string;    
  sender: Sender;     
  requestId?: string; 
};