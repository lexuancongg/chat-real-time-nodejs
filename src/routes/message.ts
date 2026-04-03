import express, { Router, Request, Response, NextFunction } from 'express';
import { LoginRequestDto, RegisterRequestDto, RegisterResponseDto } from '../models/auth/auth';
import { ApiResponse } from '../models/response/response';
import authController from '../controllers/authController';
import userController from '../controllers/userController';
import { Message } from '../models/messages/message';
import messageController from '../controllers/messageController';
const messageRouter: Router = express.Router();
type ReqParams = { id: string };

const getConversationHandler = async (
  req: Request<ReqParams>,
  res: Response<ApiResponse<Message[]>>,
  next: NextFunction
) => {
  return messageController.getMessagesByConversationId(req, res, next);
};

messageRouter.get("/conversation/:id", getConversationHandler)
export default messageRouter;