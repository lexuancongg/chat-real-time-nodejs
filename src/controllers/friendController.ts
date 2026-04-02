import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../models/response/response";
import prisma from "../../prisma/client";
import { FriendRequestResponse } from "../models/friends/friend";

class FriendController {
    async getCountRequestFriends(
        req: Request,
        res: Response<ApiResponse<number>>,
        next: NextFunction
    ) {
        try {
            const userId = req.session?.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, data: 0, message: "Unauthorized" });

            }
            const count = await prisma.friendRequest.count({
                where: {
                    receiverId: BigInt(userId),
                    status: "PENDING"
                }

            });
            return res.json({ success: true, data: count });
        } catch (err) {
            next(err);
        }
    }



    async getRequestFriends(
        req: Request,
        res: Response<ApiResponse<FriendRequestResponse[]>>,
        next: NextFunction
    ) {
        try {
            const userId = req.session?.user?.id; // lấy từ session
            if (!userId) {
                return res.status(401).json({ success: false, data: [], message: "Unauthorized" });
            }

            const requests = await prisma.friendRequest.findMany({
                where: { receiverId: BigInt(userId), status: "PENDING" },
                select: {
                    id: true,
                    sender: { select: { id: true, displayName: true, avatar: true } },
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            });

            const responseData: FriendRequestResponse[] = requests.map((r) => ({
                id: Number(r.id),
                createdAt: r.createdAt.toISOString(),
                sender: {
                    id: Number(r.sender.id),
                    displayName: r.sender.displayName || "Unknown",
                    avatar: r.sender.avatar?.url || null,
                },
            }));

            const response: ApiResponse<FriendRequestResponse[]> = {
                success: true,
                data: responseData,
                message: "Lấy danh sách lời mời kết bạn thành công",
            };

            res.json(response);

        } catch (err) {
            next(err);
        }
    }



}


export default new FriendController();