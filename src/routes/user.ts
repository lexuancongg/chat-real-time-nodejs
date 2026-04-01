import express, { Router, Request, Response, NextFunction } from 'express';
import { LoginRequestDto, RegisterRequestDto, RegisterResponseDto } from '../models/auth/auth';
import { ApiResponse } from '../models/response/response';
import authController from '../controllers/authController';
import userController from '../controllers/userController';
const userRouter: Router = express.Router();

userRouter.get(
  "/search",
  (
    req: Request<{}, {}, {}, { phone: string }>,
    res: Response<ApiResponse<any>>,
    next: NextFunction
  ) => {
    userController.searchByPhone(req, res, next);
  }
);


export default userRouter;