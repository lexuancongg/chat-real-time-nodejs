import {Request,Response,NextFunction} from 'express'
const websocket = require('./config/ws/socket.ts')
import http from 'http';
import configWebsocket from './config/ws/socket';
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

configWebsocket(server)


server.listen(PORT, () => console.log(`lang nghe tren cong${PORT}`));
module.exports = app;

