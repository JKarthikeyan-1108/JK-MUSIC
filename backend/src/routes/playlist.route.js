import { Router } from "express";
import { Playlist } from "../models/playlist.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.post("/", async (req, res, next) => {
	try {
		const { title, description, imageUrl, isPublic } = req.body;
		const userId = req.auth.userId;

		const playlist = new Playlist({
			title,
			description,
			imageUrl,
			isPublic,
			createdBy: userId,
			songs: [],
		});

		await playlist.save();
		res.status(201).json(playlist);
	} catch (error) {
		next(error);
	}
});

router.get("/", async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		const playlists = await Playlist.find({ createdBy: userId }).populate("songs").sort({ createdAt: -1 });
		res.json(playlists);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		const playlist = await Playlist.findById(req.params.id).populate("songs");
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}
		
		// If it's private, only creator can see
		if (!playlist.isPublic && playlist.createdBy !== req.auth.userId) {
			return res.status(403).json({ message: "Not authorized" });
		}
		
		res.json(playlist);
	} catch (error) {
		next(error);
	}
});

router.put("/:id", async (req, res, next) => {
	try {
		const { title, description, imageUrl, isPublic } = req.body;
		const playlist = await Playlist.findOneAndUpdate(
			{ _id: req.params.id, createdBy: req.auth.userId },
			{ title, description, imageUrl, isPublic },
			{ new: true }
		);

		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found or not authorized" });
		}

		res.json(playlist);
	} catch (error) {
		next(error);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		const playlist = await Playlist.findOneAndDelete({
			_id: req.params.id,
			createdBy: req.auth.userId,
		});

		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found or not authorized" });
		}

		res.json({ message: "Playlist deleted" });
	} catch (error) {
		next(error);
	}
});

router.post("/:id/songs", async (req, res, next) => {
	try {
		const { songId } = req.body;
		const playlist = await Playlist.findOne({ _id: req.params.id, createdBy: req.auth.userId });
		
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found or not authorized" });
		}
		
		if (!playlist.songs.includes(songId)) {
			playlist.songs.push(songId);
			await playlist.save();
		}
		
		res.json(playlist);
	} catch (error) {
		next(error);
	}
});

router.delete("/:id/songs/:songId", async (req, res, next) => {
	try {
		const playlist = await Playlist.findOne({ _id: req.params.id, createdBy: req.auth.userId });
		
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found or not authorized" });
		}
		
		playlist.songs = playlist.songs.filter(id => id.toString() !== req.params.songId);
		await playlist.save();
		
		res.json(playlist);
	} catch (error) {
		next(error);
	}
});

export default router;
