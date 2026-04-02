import { Application } from "express";
import authRouter from "./auth"; 
import userRouter from "./user";
import friendRouter from "./friend";
import conversationRouter from "./conversation";

const route  = (app : Application) : void =>{
    app.use("/auth",authRouter)
    app.use("/users",userRouter)
    app.use("/friends",friendRouter)
    app.use("/conversations",conversationRouter)

    
    
}

export default route