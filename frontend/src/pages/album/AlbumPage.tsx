import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
	const { albumId } = useParams();
	const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	useEffect(() => {
		if (albumId) fetchAlbumById(albumId);
	}, [fetchAlbumById, albumId]);

	if (isLoading) {
		return (
			<div className='min-h-full bg-background animate-pulse'>
				<div className='h-[400px] bg-surface-container-high' />
			</div>
		);
	}

	const handlePlayAlbum = () => {
		if (!currentAlbum) return;
		const isCurrentAlbumPlaying = currentAlbum?.songs.some((song) => song._id === currentSong?._id);
		if (isCurrentAlbumPlaying) togglePlay();
		else playAlbum(currentAlbum?.songs, 0);
	};

	const handlePlaySong = (index: number) => {
		if (!currentAlbum) return;
		playAlbum(currentAlbum?.songs, index);
	};

	const isAlbumPlaying = isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id);

	return (
		<div className='min-h-full pb-32'>
			{/* TopAppBar */}
			<header className='bg-background/80 backdrop-blur-md flex justify-between items-center px-lg py-md w-full z-40 sticky top-0'>
				<div className='flex items-center gap-md flex-1 max-w-xl'>
					<div className='flex gap-sm'>
						<button onClick={() => window.history.back()} className='bg-black/40 p-xs rounded-full flex items-center justify-center'>
							<span className='material-symbols-outlined'>chevron_left</span>
						</button>
						<button className='bg-black/40 p-xs rounded-full flex items-center justify-center opacity-50'>
							<span className='material-symbols-outlined'>chevron_right</span>
						</button>
					</div>
				</div>
				<div className='flex items-center gap-lg'>
					<button className='text-on-surface-variant hover:text-primary transition-colors'>
						<span className='material-symbols-outlined'>notifications</span>
					</button>
					<button className='text-on-surface-variant hover:text-primary transition-colors'>
						<span className='material-symbols-outlined'>settings</span>
					</button>
				</div>
			</header>

			{/* Artist Hero Section */}
			<section className='relative h-[400px] flex flex-col justify-end px-xl pb-xl'>
				<div className='absolute inset-0 z-0'>
					<img
						src={currentAlbum?.imageUrl}
						alt={currentAlbum?.title}
						className='w-full h-full object-cover'
					/>
					<div className='absolute inset-0 artist-hero-gradient' />
				</div>
				<div className='relative z-10 space-y-md'>
					<div className='flex items-center gap-sm'>
						<span className='material-symbols-outlined text-blue-400' style={{ fontVariationSettings: "'FILL' 1" }}>
							verified
						</span>
						<span className='font-label-md text-label-md uppercase tracking-widest'>Verified Artist</span>
					</div>
					<h1 className='font-display-lg text-display-lg md:text-[96px] text-on-surface tracking-tighter leading-tight'>
						{currentAlbum?.title}
					</h1>
					<p className='font-body-lg text-body-lg text-secondary'>
						{currentAlbum?.artist} • {currentAlbum?.songs.length} songs • {currentAlbum?.releaseYear}
					</p>
				</div>
			</section>

			{/* Controls Bar */}
			<div className='px-xl py-lg flex items-center gap-xl bg-gradient-to-b from-black/40 to-transparent'>
				<button
					onClick={handlePlayAlbum}
					className='w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20'
				>
					<span className='material-symbols-outlined text-4xl' style={{ fontVariationSettings: "'FILL' 1" }}>
						{isAlbumPlaying ? 'pause' : 'play_arrow'}
					</span>
				</button>
				<button className='px-xl py-sm border-2 border-outline-variant rounded-full font-bold hover:border-on-surface transition-colors'>
					Follow
				</button>
				<button className='text-on-surface-variant hover:text-on-surface'>
					<span className='material-symbols-outlined'>more_horiz</span>
				</button>
			</div>

			{/* Main Grid Layout */}
			<div className='px-xl grid grid-cols-1 lg:grid-cols-3 gap-xl'>
				{/* Popular Tracks (2/3 width on desktop) */}
				<div className='lg:col-span-2'>
					<h2 className='font-title-md text-title-md mb-md'>Popular</h2>
					<div className='flex flex-col'>
						{currentAlbum?.songs.map((song, index) => {
							const isCurrentSong = currentSong?._id === song._id;
							return (
								<div
									key={song._id}
									onClick={() => handlePlaySong(index)}
									className='group flex items-center gap-md p-md rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer'
								>
									<span className='w-6 text-on-surface-variant group-hover:hidden'>
										{isCurrentSong && isPlaying ? (
											<span className='material-symbols-outlined text-primary text-[18px]'>equalizer</span>
										) : (
											index + 1
										)}
									</span>
									<span
										className='w-6 hidden group-hover:block material-symbols-outlined text-primary'
										style={{ fontVariationSettings: "'FILL' 1" }}
									>
										play_arrow
									</span>

									<div className='w-12 h-12 bg-surface-container rounded overflow-hidden'>
										<img src={song.imageUrl} alt={song.title} className='w-full h-full object-cover' />
									</div>

									<div className='flex-1'>
										<p className={`font-body-lg text-body-lg ${isCurrentSong ? 'text-primary' : 'text-on-surface'}`}>
											{song.title}
										</p>
										<p className='font-body-sm text-body-sm text-on-surface-variant'>
											{song.artist}
										</p>
									</div>

									<span className='font-body-sm text-body-sm text-on-surface-variant'>
										{formatDuration(song.duration)}
									</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* Artist Bio Section (1/3 width on desktop) */}
				<div className='bg-surface-container-high rounded-xl p-lg h-fit border border-outline-variant/30'>
					<h3 className='font-title-md text-title-md mb-md'>About</h3>
					<div className='aspect-square w-full rounded-lg overflow-hidden mb-md'>
						<img
							src={currentAlbum?.imageUrl}
							alt={currentAlbum?.title}
							className='w-full h-full object-cover'
						/>
					</div>
					<p className='font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-lg'>
						Explore {currentAlbum?.artist}'s discography. Known for their unique sound and incredible artistry, this album showcases their best work yet.
					</p>
					<button className='text-on-surface font-bold hover:underline'>Read more</button>
				</div>
			</div>
		</div>
	);
};

export default AlbumPage;
