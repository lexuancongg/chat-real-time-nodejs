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