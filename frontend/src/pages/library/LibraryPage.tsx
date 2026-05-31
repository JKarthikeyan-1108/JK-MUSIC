import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useUserStore } from "@/stores/useUserStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ListMusic, History, Heart, Play } from "lucide-react";
import { motion } from "framer-motion";

const LibraryPage = () => {
	const { albums, fetchAlbums, isLoading: isLoadingMusic } = useMusicStore();
	const { currentAlbum, isPlaying, playAlbum, togglePlay } = usePlayerStore();
	const { playlists, recentlyPlayed, fetchPlaylists, fetchRecentlyPlayed, createPlaylist, isLoading: isLoadingPlaylists } = usePlaylistStore();
	
	const [activeTab, setActiveTab] = useState("playlists");
	
	useEffect(() => {
		fetchAlbums();
		fetchPlaylists();
		fetchRecentlyPlayed();
	}, [fetchAlbums, fetchPlaylists, fetchRecentlyPlayed]);

	const handlePlayAlbum = (e: React.MouseEvent, album: any) => {
		e.preventDefault();
		e.stopPropagation();
		if (currentAlbum?._id === album._id) {
			togglePlay();
		} else {
			playAlbum(album.songs, 0);
		}
	};
	
	const handleCreatePlaylist = () => {
		const name = prompt("Playlist name:", "New Playlist");
		if (name) {
			createPlaylist({ title: name, isPublic: false });
		}
	};

	const isLoading = isLoadingMusic || isLoadingPlaylists;

	return (
		<div className="h-full flex flex-col bg-background overflow-hidden relative">
			{/* Ambient Header Gradient */}
			<div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-apple-red/10 via-black/5 to-transparent pointer-events-none z-0" />
			
			<div className="relative z-10 flex-shrink-0">
				<Topbar />
			</div>
			
			<div className='flex-1 overflow-y-auto px-4 md:px-8 pb-32 pt-6 max-w-7xl mx-auto w-full no-scrollbar relative z-10'>
				<header className="mb-8">
					<h1 className='text-display-sm font-bold text-white tracking-tight mb-6'>Library</h1>

					{/* Tabs */}
					<div className='flex gap-3 overflow-x-auto no-scrollbar'>
						{["playlists", "artists", "albums", "songs"].map(tab => (
							<button 
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-5 py-2 rounded-full text-label-md font-semibold whitespace-nowrap transition-all ${
									activeTab === tab 
										? 'bg-apple-red text-white' 
										: 'bg-white/5 text-text-secondary hover:bg-white/10'
								}`}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</button>
						))}
					</div>
				</header>
				
				<div className="space-y-12">
					{/* Recently Played */}
					{recentlyPlayed.length > 0 && (
						<section>
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-title-lg font-bold text-white flex items-center gap-2">
									<History size={20} className="text-apple-red" />
									Recently Played
								</h2>
							</div>
							
							<div className='flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x'>
								{recentlyPlayed.map((item) => (
									<div 
										key={item._id} 
										className='min-w-[140px] md:min-w-[160px] snap-start group relative'
									>
										<div className='aspect-square w-full mb-3 overflow-hidden rounded-lg shadow-lg relative bg-surface-container'>
											<img
												src={item.song.imageUrl}
												alt={item.song.title}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
											/>
											<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
											<button className='absolute bottom-3 right-3 w-10 h-10 bg-apple-red text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100'>
												<Play fill="currentColor" size={18} className="ml-1" />
											</button>
										</div>
										<h3 className='text-body-md font-bold text-white truncate'>
											{item.song.title}
										</h3>
										<p className='text-body-sm text-text-secondary truncate'>
											{item.song.artist}
										</p>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Playlists Grid */}
					<section>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-title-lg font-bold text-white flex items-center gap-2">
								<ListMusic size={20} className="text-apple-red" />
								Your Playlists
							</h2>
							<button 
								onClick={handleCreatePlaylist}
								className="text-apple-red hover:text-white transition-colors flex items-center gap-1 text-label-md font-bold"
							>
								<Plus size={16} /> New
							</button>
						</div>
						
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'>
							{/* Liked Songs */}
							<div className='group cursor-pointer'>
								<div className='aspect-square w-full mb-3 overflow-hidden rounded-lg shadow-lg relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'>
									<div className='absolute inset-0 flex items-center justify-center'>
										<Heart size={48} className="text-white drop-shadow-md" fill="white" />
									</div>
									<button className='absolute bottom-3 right-3 w-10 h-10 bg-apple-red text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100'>
										<Play fill="currentColor" size={18} className="ml-1" />
									</button>
								</div>
								<h3 className='text-body-md font-bold text-white truncate'>
									Liked Songs
								</h3>
								<p className='text-body-sm text-text-secondary truncate'>
									{useUserStore().likedSongs.length} songs
								</p>
							</div>

							{/* User Playlists */}
							{playlists.map((playlist) => (
								<div key={playlist._id} className='group cursor-pointer'>
									<div className='aspect-square w-full mb-3 overflow-hidden rounded-lg shadow-lg relative bg-white/5 flex items-center justify-center'>
										{playlist.imageUrl ? (
											<img
												src={playlist.imageUrl}
												alt={playlist.title}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
											/>
										) : (
											<ListMusic size={40} className="text-white/20" />
										)}
										<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										<button className='absolute bottom-3 right-3 w-10 h-10 bg-apple-red text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100'>
											<Play fill="currentColor" size={18} className="ml-1" />
										</button>
									</div>
									<h3 className='text-body-md font-bold text-white truncate'>
										{playlist.title}
									</h3>
									<p className='text-body-sm text-text-secondary truncate'>
										{playlist.songs.length} songs
									</p>
								</div>
							))}
						</div>
					</section>

					{/* Recently Added (Albums) */}
					<section>
						<h2 className="text-title-lg font-bold text-white mb-4">Recently Added</h2>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'>
							{isLoading ? (
								Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className='animate-pulse'>
										<div className='aspect-square w-full mb-3 bg-white/5 rounded-lg' />
										<div className='h-4 bg-white/5 rounded w-3/4 mb-2' />
										<div className='h-3 bg-white/5 rounded w-1/2' />
									</div>
								))
							) : (
								albums.map((album) => {
									const isCurrentAlbum = currentAlbum?._id === album._id;
									return (
										<Link
											to={`/albums/${album._id}`}
											key={album._id}
											className='group relative block'
										>
											<div className='aspect-square w-full mb-3 overflow-hidden rounded-lg shadow-lg relative bg-surface-container'>
												<img
													src={album.imageUrl}
													alt={album.title}
													className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
												/>
												<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
												<button
													onClick={(e) => handlePlayAlbum(e, album)}
													className={`absolute bottom-3 right-3 w-10 h-10 bg-apple-red text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 ${
														isCurrentAlbum && isPlaying
															? 'opacity-100 translate-y-0'
															: 'opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100'
													}`}
												>
													{isCurrentAlbum && isPlaying ? (
														<span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
													) : (
														<Play fill="currentColor" size={18} className="ml-1" />
													)}
												</button>
											</div>
											<h3 className='text-body-md font-bold text-white truncate'>
												{album.title}
											</h3>
											<p className='text-body-sm text-text-secondary truncate'>
												Album • {album.artist}
											</p>
										</Link>
									);
								})
							)}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default LibraryPage;
