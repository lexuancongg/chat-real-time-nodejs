import express, { Router, Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../models/response/response';
import friendController from '../controllers/friendController';
import { FriendRequestResponse} from '../models/friends/friend';
const friendRouter: Router = express.Router();


friendRouter.get(
  "/count-requests",
  (
    req: Request,
    res: Response<ApiResponse<number>>,
    next: NextFunction
  ) =>{ 
    friendController.getCountRequestFriends(req,res,next)
   }
);

friendRouter.get(
    "/requests",
    (
    req: Request,
    res: Response<ApiResponse<FriendRequestResponse[]>>,
    next: NextFunction
  ) =>{ 
    friendController.getRequestFriends(req,res,next)
   }

)


export default friendRouter;