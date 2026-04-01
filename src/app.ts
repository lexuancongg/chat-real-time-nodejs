import express, { Request, Response, NextFunction } from "express";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import configWebsocket from "./config/ws/socket";
import route from "./routes/index";
import { sessionMiddleware } from "./middlewares/session";

const app = express();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
app.use(express.json());    
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true })); 


app.use(sessionMiddleware);
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true 
}));

app.use(cookieParser())
const PORT = 8000;
route(app);



app.use((err:Error, req : Request, res:Response, next : NextFunction) => {
    console.error("Middleware lỗi:", err.message);
    res.status(500).send("Lỗi rồi");
});


const server = http.createServer(app)

configWebsocket(server)



server.listen(PORT, () => console.log(`lang nghe tren cong${PORT}`));

export default app;

