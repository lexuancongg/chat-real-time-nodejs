import { NextFunction, Request, Response } from "express";
import { hash, compare } from "bcrypt";
import prisma from "../../prisma/client";
import { LoginRequestDto, RegisterRequestDto, RegisterResponseDto } from "../models/auth/auth";
import { ApiResponse } from "../models/response/response";

class AuthController {
  async register(req: Request<{}, {}, RegisterRequestDto>, res: Response<ApiResponse<RegisterResponseDto>>, next: NextFunction) {
    try {
      const { password, username, displayName } = req.body;
      const existingUser = await prisma.user.findUnique({ where: { username } });
      if (existingUser) {
        const response: ApiResponse<RegisterResponseDto> = {
          success: false,
          error: {
            code: "DUPLICATE",
            message: "username is exited"
          }
        }
        return res.status(400).json(response);
      }
      const hashedPassword = await hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          displayName: displayName
        },
      });


      const response: ApiResponse<RegisterResponseDto> = {
        success: true,
        data: {
          id: Number(newUser.id),
          username: newUser.username
        },
        message: "success"
      }

      return res.status(201).json(response);
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request<{}, {}, LoginRequestDto>, res: Response<ApiResponse<void>>, next: NextFunction) {
    try {
      const { password, username } = req.body;
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: { code: "INVALID_CREDENTIALS", message: "Sai username hoặc password" }
        });
      }
      const isMatch = await compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: { code: "INVALID_CREDENTIALS", message: "Sai username hoặc password" }
        });
      }
      req.session.user = {
        id: Number(user.id),
        username: user.username,
        roles: ["USER"]
      };

      return res.status(200).json({
        success: true,
      });
    } catch (error) {

    }

  }


}


export default new AuthController();