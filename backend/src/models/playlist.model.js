import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: "",
		},
		imageUrl: {
			type: String,
			default: "",
		},
		songs: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Song",
			},
		],
		createdBy: {
			type: String, // clerkId
			required: true,
		},
		isPublic: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
