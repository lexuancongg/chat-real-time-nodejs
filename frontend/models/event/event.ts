
export enum WsEventType {
  NEW_MESSAGE = "NEW_MESSAGE",
  NEW_REQUEST_FRIEND = "NEW_REQUEST_FRIEND",
  FRIEND_ACCEPTED = "FRIEND_ACCEPTED",
  FRIEND_BLOCKED = "FRIEND_BLOCKED",
  NEW_ADD_FRIEND="NEW_ADD_FRIEND",
}

export type WsEvent<T = any> = {
  type: WsEventType;
  data: T;
};





export type WsResponse<T = any> = {
  type: WsEventType;  
  payload: T;
};