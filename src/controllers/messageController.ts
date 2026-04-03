import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import { ApiResponse } from "../models/response/response";
import { Message } from "../models/messages/message";

class MessageController {
    async getMessagesByConversationId(
        req: Request,
        res: Response<ApiResponse<Message[]>>,
        next: NextFunction
    ) {
        try {
            const conversationId = Number(req.params.id);
            const currentUserId = req.session?.user?.id;

            if (!currentUserId) {
                return res.status(401).json({ success: false, message: "Unauthorized", data: [] });
            }

            // Lấy message theo conversationId, include sender info
            const messagesFromDb = await prisma.message.findMany({
                where: { conversationId },
                include: { sender: { select: { id: true, displayName: true, avatar: { select: { url: true } } } } },
                orderBy: { createdAt: "asc" },
            });

            const messages: Message[] = messagesFromDb.map((m) => ({
                id: m.id,
                content: m.content,
                createdAt: m.createdAt.toISOString(),
                status: m.status,
                sender: {
                    id: m.sender.id,
                    displayName: m.sender.displayName || "", // <-- fix null
                    avatar: m.sender.avatar?.url || null,
                },
                //   type: m.type,
                isMine: m.sender.id === currentUserId,
            }));

            return res.json({ success: true, message: "Messages fetched", data: messages });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

export default new MessageController();