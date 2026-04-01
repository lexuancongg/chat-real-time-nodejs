type WSMessage =
  | { type: "NEW_FRIEND"; payload: { from:number,to:number } }
  | { type: "CHAT_MESSAGE"; payload: { from: string; text: string } }
  | { type: "TYPING"; payload: { from: string } };