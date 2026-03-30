import express, { Router, Request, Response } from 'express';
import { RegisterRequestDto } from '../models/auth/auth';
import prisma from '../../prisma/client';
const authRouter: Router = express.Router();

authRouter.post("/register", async (req: Request<{}, {}, RegisterRequestDto>, res: Response) => {
    try {
        const { password, username } = req.body;

       
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            res.status(400).json({ message: "Username đã tồn tại" });
            return;
        }

        const newUser = await prisma.user.create({
            data: { username, password },
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" });
    }
});

export default authRouter;