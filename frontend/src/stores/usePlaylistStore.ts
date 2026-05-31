import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { Song } from "@/types";

interface Playlist {
	_id: string;
	title: string;
	description: string;
	imageUrl: string;
	songs: Song[];
	createdBy: string;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

interface RecentlyPlayed {
	_id: string;
	userId: string;
	song: Song;
	playedAt: string;
}

interface PlaylistStore {
	playlists: Playlist[];
	recentlyPlayed: RecentlyPlayed[];
	isLoading: boolean;
	error: string | null;

	fetchPlaylists: () => Promise<void>;
	fetchRecentlyPlayed: () => Promise<void>;
	createPlaylist: (data: { title: string; description?: string; isPublic?: boolean }) => Promise<void>;
	deletePlaylist: (playlistId: string) => Promise<void>;
	addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
	removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
	playlists: [],
	recentlyPlayed: [],
	isLoading: false,
	error: null,

	fetchPlaylists: async () => {
		set({ isLoading: true, error: null });
		try {
			const res = await axiosInstance.get("/playlists");
			set({ playlists: res.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to fetch playlists" });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchRecentlyPlayed: async () => {
		set({ isLoading: true, error: null });
		try {
			const res = await axiosInstance.get("/users/recently-played");
			set({ recentlyPlayed: res.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to fetch recently played" });
		} finally {
			set({ isLoading: false });
		}
	},

	createPlaylist: async (data) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.post("/playlists", data);
			await get().fetchPlaylists();
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to create playlist" });
		} finally {
			set({ isLoading: false });
		}
	},

	deletePlaylist: async (playlistId) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/playlists/${playlistId}`);
			set((state) => ({
				playlists: state.playlists.filter((p) => p._id !== playlistId),
			}));
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to delete playlist" });
		} finally {
			set({ isLoading: false });
		}
	},

	addSongToPlaylist: async (playlistId, songId) => {
		try {
			await axiosInstance.post(`/playlists/${playlistId}/songs`, { songId });
			await get().fetchPlaylists(); // Refresh to get updated songs array
		} catch (error: any) {
			console.error("Failed to add song to playlist", error);
		}
	},

	removeSongFromPlaylist: async (playlistId, songId) => {
		try {
			await axiosInstance.delete(`/playlists/${playlistId}/songs/${songId}`);
			await get().fetchPlaylists();
		} catch (error: any) {
			console.error("Failed to remove song from playlist", error);
		}
	},
}));
