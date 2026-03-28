import {Request,Response,NextFunction} from 'express'
import WebSocket, { WebSocketServer } from 'ws'
import http from 'http';
const express = require('express')
require('dotenv').config();
const cors = require('cors');  
var cookieParser = require('cookie-parser')
const passport = require('passport');    // authencation
const route = require('./routes/index');
const app = express();


app.use(express.json());    // đọc và gởi dữ liệu dạng json
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true })); // xử lý dữ liệu từ client gởi lên từ form khi submit mặc định

app.use(cors({
    origin: "*",
    methods: 'GET, POST, PUT, DELETE, OPTIONS,PATCH',
    allowedHeaders: "Accept,authorization,Authorization, Content-Type"
}));

app.use(cookieParser())
// app.use(morgan('combined'));     // log lại những yêu cầu request
const PORT = 3000;
route(app);



app.use((err:Error, req : Request, res:Response, next : NextFunction) => {
    console.error("Middleware lỗi:", err.message);
    res.status(500).send("Lỗi rồi");
});


const server = http.createServer(app)
const wss = new WebSocketServer({ server });



const clients = new Map<string, WebSocket>();
const rooms = new Map<string, Set<string>>(); 

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  const url = new URL(req.url!, 'http://localhost');
  const userId = url.searchParams.get('userId')!;


  clients.set(userId, ws);

  ws.on('message', (data: Buffer) => {
    console.log('Received:', data.toString());

    ws.send('Server nhận rồi ');
  });

  ws.on('error', (err: Error) => {
    console.error(' Error:', err.message);
  });

  ws.on('close', (code: number, reason: Buffer) => {
    console.log(' Client disconnected', code, reason.toString());
  });

  ws.send('Welcome bro 😎');
});

wss.on('error', (err: Error) => {
  console.error(' WSS Error:', err.message);
});





server.listen(PORT, () => console.log(`lang nghe tren cong${PORT}`));
module.exports = app;

