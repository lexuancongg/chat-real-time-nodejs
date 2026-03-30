import express, { Router, Request, Response, NextFunction } from 'express';
import { LoginRequestDto, RegisterRequestDto, RegisterResponseDto } from '../models/auth/auth';
import { ApiResponse } from '../models/response/response';
import authController from '../controllers/authController';
const authRouter: Router = express.Router();


authRouter.post(
  "/register",
  (
    req: Request<{}, {}, RegisterRequestDto>,
    res: Response<ApiResponse<RegisterResponseDto>>,
    next: NextFunction
  ) =>{ authController.register(req, res, next) }
);

authRouter.post(
    "/login",
    (
    req: Request<{}, {}, LoginRequestDto>,
    res: Response<ApiResponse<void>>,
    next: NextFunction
  ) =>{ authController.login(req, res, next) }
)

export default authRouter;