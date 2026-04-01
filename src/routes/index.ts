import { Application } from "express";
import authRouter from "./auth"; 
import userRouter from "./user";

const route  = (app : Application) : void =>{
    app.use("/auth",authRouter)
    app.use("/users",userRouter)

    
    
}

export default route