import { Application } from "express";
import authRouter from "./auth"; 
import userRouter from "./user";
import friendRouter from "./friend";
import conversationRouter from "./conversation";
import messageRouter from "./message";

const route  = (app : Application) : void =>{
    app.use("/auth",authRouter)
    app.use("/users",userRouter)
    app.use("/friends",friendRouter)
    app.use("/conversations",conversationRouter)
    app.use("/messages",messageRouter)

    
    
}

export default route