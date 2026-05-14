import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LibraryPage = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
	const { currentAlbum, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	const handlePlayAlbum = (e: React.MouseEvent, album: any) => {
		e.preventDefault();
		e.stopPropagation();
		if (currentAlbum?._id === album._id) {
			togglePlay();
		} else {
			playAlbum(album.songs, 0);
		}
	};

	return (
		<>
			<Topbar />
			<div className='px-lg md:px-xl pb-32 pt-md max-w-7xl mx-auto'>
				<section>
					<h1 className='font-headline-lg text-headline-lg mb-lg text-on-surface'>Your Library</h1>

					{/* Filters */}
					<div className='flex gap-sm mb-xl overflow-x-auto no-scrollbar'>
						<button className='bg-primary text-on-primary px-lg py-xs rounded-full font-label-md text-label-md whitespace-nowrap'>
							All
						</button>
						<button className='bg-surface-container-high text-on-surface-variant hover:bg-surface-variant px-lg py-xs rounded-full font-label-md text-label-md whitespace-nowrap transition-colors'>
							Playlists
						</button>
						<button className='bg-surface-container-high text-on-surface-variant hover:bg-surface-variant px-lg py-xs rounded-full font-label-md text-label-md whitespace-nowrap transition-colors'>
							Artists
						</button>
						<button className='bg-surface-container-high text-on-surface-variant hover:bg-surface-variant px-lg py-xs rounded-full font-label-md text-label-md whitespace-nowrap transition-colors'>
							Albums
						</button>
						<button className='bg-surface-container-high text-on-surface-variant hover:bg-surface-variant px-lg py-xs rounded-full font-label-md text-label-md whitespace-nowrap transition-colors'>
							Podcasts
						</button>
					</div>

					{/* Grid */}
					<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-gutter'>
						{/* Special Liked Songs Card */}
						<div className='group relative bg-surface-container-low p-md rounded-lg hover:bg-surface-container-high transition-all duration-300 cursor-pointer'>
							<div className='aspect-square w-full mb-md overflow-hidden rounded-lg shadow-lg relative bg-gradient-to-br from-primary/80 to-surface-container'>
								<div className='absolute inset-0 flex items-center justify-center'>
									<span className='material-symbols-outlined text-[80px] text-white opacity-80' style={{ fontVariationSettings: "'FILL' 1" }}>
										favorite
									</span>
								</div>
								<button className='absolute bottom-md right-md bg-primary text-background p-md rounded-full shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105'>
									<span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>
										play_arrow
									</span>
								</button>
							</div>
							<h3 className='font-title-md text-body-lg text-on-surface text-nowrap overflow-hidden text-ellipsis'>
								Liked Songs
							</h3>
							<p className='font-body-sm text-body-sm text-on-surface-variant'>
								Playlist • {useUserStore().likedSongs.length} songs
							</p>
						</div>

						{/* Dynamic Albums */}
						{isLoading ? (
							Array.from({ length: 9 }).map((_, i) => (
								<div key={i} className='bg-surface-container-low p-md rounded-lg animate-pulse'>
									<div className='aspect-square w-full mb-md bg-surface-container-high rounded-lg' />
									<div className='h-4 bg-surface-container-high rounded w-3/4 mb-2' />
									<div className='h-3 bg-surface-container-high rounded w-1/2' />
								</div>
							))
						) : (
							albums.map((album) => {
								const isCurrentAlbum = currentAlbum?._id === album._id;
								return (
									<Link
										to={`/albums/${album._id}`}
										key={album._id}
										className='group relative bg-surface-container-low p-md rounded-lg hover:bg-surface-container-high transition-all duration-300'
									>
										<div className='aspect-square w-full mb-md overflow-hidden rounded-lg shadow-lg relative'>
											<img
												src={album.imageUrl}
												alt={album.title}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
											/>
											<button
												onClick={(e) => handlePlayAlbum(e, album)}
												className={`absolute bottom-md right-md w-12 h-12 bg-primary text-background rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 ${
													isCurrentAlbum && isPlaying
														? 'opacity-100 translate-y-0'
														: 'opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100'
												}`}
											>
												<span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>
													{isCurrentAlbum && isPlaying ? 'pause' : 'play_arrow'}
												</span>
											</button>
										</div>
										<h3 className='font-title-md text-body-lg text-on-surface text-nowrap overflow-hidden text-ellipsis'>
											{album.title}
										</h3>
										<p className='font-body-sm text-body-sm text-on-surface-variant'>
											Album • {album.artist}
										</p>
									</Link>
								);
							})
						)}
					</div>
				</section>
			</div>
		</>
	);
};

export default LibraryPage;
