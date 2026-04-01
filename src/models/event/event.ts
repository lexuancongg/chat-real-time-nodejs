type WsEvent<T = any> = {
  type: string;
  data: T;
};