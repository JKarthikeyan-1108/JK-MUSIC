import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
	likedSongs: string[]; // Store song IDs
	toggleLike: (songId: string) => void;
	isLiked: (songId: string) => boolean;
}

export const useUserStore = create<UserStore>()(
	persist(
		(set, get) => ({
			likedSongs: [],
			
			toggleLike: (songId) => {
				set((state) => {
					const isLiked = state.likedSongs.includes(songId);
					if (isLiked) {
						return { likedSongs: state.likedSongs.filter((id) => id !== songId) };
					} else {
						return { likedSongs: [...state.likedSongs, songId] };
					}
				});
			},

			isLiked: (songId) => get().likedSongs.includes(songId),
		}),
		{
			name: 'user-storage', // name of the item in the storage (must be unique)
		}
	)
);
