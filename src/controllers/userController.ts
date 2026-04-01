import { NextFunction, Request, Response } from "express";
import { hash, compare } from "bcrypt";
import prisma from "../../prisma/client";
import { LoginRequestDto, RegisterRequestDto, RegisterResponseDto } from "../models/auth/auth";
import { ApiResponse } from "../models/response/response";

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



}


export default new UserController();