import { Request, Response, NextFunction } from 'express';
export interface CustomRequest extends Request {
    cookies: { [key: string]: string };
    user?: any;
    session: any;
}
const jwt = require('jsonwebtoken')


const auth_jwt = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ message: 'you need login' });

    try {
        const decode = jwt.verify(token,process.env.SERECT_KEY)
        req.user = decode
        next();
    } catch (error) {
        res.status(401).json("token is valid")
    }

}


const auth_sesion = (req:CustomRequest, res:Response , next:NextFunction)=>{
    if(req.session && req.session.user){
        req.user = req.session.user;
        next();
    }else{
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}

export {auth_jwt}