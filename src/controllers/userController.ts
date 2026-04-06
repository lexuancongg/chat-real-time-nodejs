import { NextFunction, Request, Response } from "express";
import { hash, compare } from "bcrypt";
import prisma from "../../prisma/client";
import { LoginRequestDto, RegisterRequestDto, RegisterResponseDto } from "../models/auth/auth";
import { ApiResponse } from "../models/response/response";


export type ProfileInfo = {
  id: number;
  displayName: string;
  avatarUrl: string | null;
};

class UserController {
    async searchByPhone(
        req: Request<{}, {}, {}, { phone: string }>,
        res: Response<ApiResponse<any>>,
        next: NextFunction
    ) {
        try {
            const { phone } = req.query;

            const user = await prisma.user.findUnique({
                where: { phone },
                select: {
                    id: true,
                    displayName: true,
                    avatar: true,
                },
            });

            return res.json({
                success: true,
                data: user,
            });
        } catch (err) {
            next(err);
        }
    }

    async getProfile(req: Request, res: Response<ApiResponse<ProfileInfo>>, next: NextFunction) {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          displayName: true,
          avatar: { select: { url: true } } // giả sử avatar là relation
        }
      });

      if (!user) {
        return res.status(404).json({ success: false, message: "User không tồn tại" });
      }

      const profile: ProfileInfo = {
        id: user.id,
        displayName: user.displayName!,
        avatarUrl: user.avatar?.url ?? null,
      };

      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }



}


export default new UserController();