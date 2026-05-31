import mongoose from "mongoose";

const recentlyPlayedSchema = new mongoose.Schema({
	userId: {
		type: String, // clerkId
		required: true,
	},
	song: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Song",
		required: true,
	},
	playedAt: {
		type: Date,
		default: Date.now,
	},
});

recentlyPlayedSchema.index({ userId: 1, playedAt: -1 });

export const RecentlyPlayed = mongoose.model("RecentlyPlayed", recentlyPlayedSchema);
