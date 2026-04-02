import express, { Router, Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../models/response/response';
import friendController from '../controllers/friendController';
import { FriendRequestResponse} from '../models/friends/friend';
import conversationController from '../controllers/conversationController';
const conversationRouter: Router = express.Router();


conversationRouter.post(
  "/private",
  (
    req: Request<{},{},{userId:number}>,
    res: Response<ApiResponse<number>>,
    next: NextFunction
  ) =>{ 
    conversationController.getOrCreateConversationByUserId(req,res,next)
   }
);



export default conversationRouter;