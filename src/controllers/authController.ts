import { NextFunction, Request, Response } from "express";
import { hash } from "bcrypt";
import prisma from "../../prisma/client";

interface RegisterDto {
  username: string;
  password: string;
}

class AuthController {
  async register(req: Request<{}, {}, RegisterDto>, res: Response, next: NextFunction) {
    try {
      const { password, username } = req.body;
      const existingUser = await prisma.user.findUnique({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: "Username đã tồn tại" });
      }
      const hashedPassword = await hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      return res.status(201).json({ message: "Tạo tài khoản thành công", user: newUser });
    } catch (error) {
      next(error)
    }
  }

} 