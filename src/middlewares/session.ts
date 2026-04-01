import session from "express-session";

const MemoryStore = session.MemoryStore;
export const sessionStore = new MemoryStore();

export const sessionMiddleware = session({
  store: sessionStore, 
  secret: "ABCDIIKWUEJBUENLKUIESFJJBSNCJSJSJB",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    secure: false,
  },
  rolling: true,
});