type MessageType = "TEXT" | "IMAGE" | "FILE" | "VIDEO";

type MessageStatus = "SENT" | "DELIVERED" | "SEEN";

type Sender = {
  id: number;
  displayName: string;
  avatar?: string;
};

export type WSMessagePayload = {
  id?: string;
  type: "TEXT" | "IMAGE" | "FILE" | "VIDEO" | "FRIEND_REQUEST"; 
  conversationId?: number;    
  sender?: Sender;
  recipientId?: string|number;       
  content?: string;           
  status?: MessageStatus;     
  createdAt?: string;
};




export type NewRequestFriendResponsePayload = {
  message: string;    
  sender: Sender;     
  requestId?: string; 
};


export type Message = {
  id: number;
  content: string;
  createdAt: string;
  status: "SENT" | "DELIVERED" | "SEEN";
  sender: {
    id: number;
    displayName: string;
    avatar: string | null;
  };
  type?: "TEXT" | "IMAGE" | "FILE";
  attachments?: { url: string; type: "IMAGE" | "FILE" }[];
  isMine: boolean; 
};



export interface CreateMessageDto {
  conversationId: number; // id cuộc trò chuyện
  senderId: number;       // id người gửi
  content: string;        // nội dung tin nhắn
  type?: "TEXT" | "IMAGE" | "FILE"; // optional, default TEXT
}