import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/client";
import { ApiResponse } from "../models/response/response";

class ConversationController {
  async getOrCreateConversationByUserId(
    req: Request<{}, {}, { userId: number }>,
    res: Response<ApiResponse<number>>,
    next: NextFunction
  ) {
    try {
      const { userId } = req.body;
      const myId = req.session.user?.id;

      if (!myId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const conversation = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          AND: [
            {
              members: {
                some: { userId: myId },
              },
            },
            {
              members: {
                some: { userId: userId },
              },
            },
          ],
        },
      });

      if (conversation) {
        return res.json({
          success: true,
          message: "OK",
          data: Number(conversation.id),
        });
      }

      const newConv = await prisma.conversation.create({
        data: {
          isGroup: false,
          members: {
            create: [
              { userId: myId },
              { userId: userId }, 
            ],
          },
        },
      });

      return res.json({
        success: true,
        message: "Created",
        data: Number(newConv.id)
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new ConversationController();