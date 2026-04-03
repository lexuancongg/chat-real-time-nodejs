import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import { Conversation } from "../models/conversations/conversation";

class ConversationController {
  async getOrCreateConversationByUserId(
    req: Request<{}, {}, { userId: number }>,
    res: Response<{ success: boolean; message: string; data?: Conversation }>,
    // next: NextFunction
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

      // tìm conversation 1-1
      let conversation = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          AND: [
            { members: { some: { userId: myId } } },
            { members: { some: { userId } } },
          ],
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      // nếu chưa có thì tạo mới
      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            isGroup: false,
            members: {
              create: [{ userId: myId }, { userId }],
            },
          },
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        });
      }

      // xác định tên hiển thị
      let displayName = conversation.isGroup
        ? conversation.name || "Group"
        : conversation.members.find((m) => m.userId !== myId)?.user.displayName || "User";

      let avatarUrl = conversation.isGroup
        ? null : ""
        // : conversation.members.find((m) => m.userId !== myId)?.user.avatar?.url || null;

      const result: Conversation = {
        id: conversation.id,
        isGroup: conversation.isGroup,
        name: displayName,
        avatarUrl,
        lastMessage: "", // có thể bổ sung sau khi join với Message
        lastMessageTime: new Date(),
        unread: 0, // có thể tính sau
        status: null, // có thể lấy ONLINE/OFFLINE từ User.status
      };

      return res.json({
        success: true,
        message: "OK",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new ConversationController();