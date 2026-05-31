import { Server } from "socket.io";
import { Message } from "../models/message.model.js";
import { RecentlyPlayed } from "../models/recentlyPlayed.model.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
			credentials: true,
		},
	});

	const userSockets = new Map(); // { userId: socketId}
	const userActivities = new Map(); // {userId: activity}

	io.on("connection", (socket) => {
		socket.on("user_connected", (userId) => {
			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			// broadcast to all connected sockets that this user just logged in
			io.emit("user_connected", userId);

			socket.emit("users_online", Array.from(userSockets.keys()));

			io.emit("activities", Array.from(userActivities.entries()));
		});

		socket.on("update_activity", async ({ userId, activity, songId }) => {
			console.log("activity updated", userId, activity);
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });

			if (songId) {
				try {
					// Upsert logic: if same song was played in last 30 seconds by this user, update timestamp.
					// Otherwise create new entry.
					const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
					
					const existingEntry = await RecentlyPlayed.findOne({
						userId,
						song: songId,
						playedAt: { $gte: thirtySecondsAgo }
					});

					if (existingEntry) {
						existingEntry.playedAt = new Date();
						await existingEntry.save();
					} else {
						await RecentlyPlayed.create({
							userId,
							song: songId,
							playedAt: new Date(),
						});
					}
				} catch (err) {
					console.error("Error saving recently played:", err);
				}
			}
		});

		socket.on("send_message", async (data) => {
			try {
				const { senderId, receiverId, content } = data;

				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});

				// send to receiver in realtime, if they're online
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}

				socket.emit("message_sent", message);
			} catch (error) {
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		socket.on("disconnect", () => {
			let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				// find disconnected user
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};
