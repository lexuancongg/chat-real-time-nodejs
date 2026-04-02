
export type UserSearchResult = {
  id: number;
  displayName: string;
  avatarUrl: string | null;
  status: Status;
};

export type Status = "ONLINE" | "OFFLINE";