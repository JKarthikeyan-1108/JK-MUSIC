import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { RecentlyPlayed } from "../models/recentlyPlayed.model.js";

export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

export const getRecentlyPlayed = async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		const recentlyPlayed = await RecentlyPlayed.find({ userId })
			.sort({ playedAt: -1 })
			.limit(20)
			.populate("song");

		res.status(200).json(recentlyPlayed);
	} catch (error) {
		next(error);
	}
};
