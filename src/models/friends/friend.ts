export type FriendRequestResponse = {
  id: number; 
  sender: {
    id: number;
    displayName: string;
    avatar?: string | null;
  };
  createdAt: string; 
};

