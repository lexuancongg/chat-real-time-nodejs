import express, { Request, Response, NextFunction } from "express";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import configWebsocket from "./config/ws/socket";
import route from "./routes/index";
import prisma from "../prisma/client";

const app = express();

app.use(express.json());    // đọc và gởi dữ liệu dạng json
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true })); // xử lý dữ liệu từ client gởi lên từ form khi submit mặc định

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true 
}));

app.use(cookieParser())
// app.use(morgan('combined'));     // log lại những yêu cầu request
const PORT = 8000;
route(app);



app.use((err:Error, req : Request, res:Response, next : NextFunction) => {
    console.error("Middleware lỗi:", err.message);
    res.status(500).send("Lỗi rồi");
});


const server = http.createServer(app)

configWebsocket(server)
console.log("DB URL:", process.env.DATABASE_URL);

await prisma.$connect();
console.log("Connected DB");


server.listen(PORT, () => console.log(`lang nghe tren cong${PORT}`));

export default app;

