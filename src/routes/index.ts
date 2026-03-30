import { Application } from "express";
import authRouter from "./auth"; 

const route  = (app : Application) : void =>{
    app.use("/auth",authRouter)
    
    
}

export default route