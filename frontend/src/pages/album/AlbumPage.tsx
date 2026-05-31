import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccentColor } from "@/hooks/useAccentColor";
import { Play, Pause, MoreHorizontal, Heart, Shuffle, ArrowLeft } from "lucide-react";

const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
	const { albumId } = useParams();
	const navigate = useNavigate();
	const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
	const accentColor = useAccentColor(currentAlbum?.imageUrl);

	useEffect(() => {
		if (albumId) fetchAlbumById(albumId);
	}, [fetchAlbumById, albumId]);

	if (isLoading) {
		return (
			<div className='h-full flex flex-col bg-background'>
				<div className='h-[400px] w-full animate-pulse bg-surface-container' />
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
		<div className='h-full flex flex-col overflow-y-auto bg-background no-scrollbar relative' style={{
			backgroundImage: `linear-gradient(to bottom, ${accentColor}33 0%, var(--background) 500px)`
		}}>
			{/* Sticky Header */}
			<header className='sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-white/5'>
				<button 
					onClick={() => navigate(-1)} 
					className='w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white'
				>
					<ArrowLeft size={24} />
				</button>
			</header>

			{/* Hero Section */}
			<section className='px-6 md:px-12 pt-8 pb-10 flex flex-col md:flex-row items-end gap-6 md:gap-10'>
				<div className='w-48 h-48 md:w-64 md:h-64 flex-shrink-0 shadow-2xl rounded-lg overflow-hidden'>
					<img
						src={currentAlbum?.imageUrl}
						alt={currentAlbum?.title}
						className='w-full h-full object-cover'
					/>
				</div>
				
				<div className='flex flex-col gap-2 flex-grow'>
					<span className='font-bold text-label-md uppercase tracking-widest text-text-secondary'>
						Album
					</span>
					<h1 className='text-display-lg md:text-[80px] font-bold text-white tracking-tighter leading-none mb-2'>
						{currentAlbum?.title}
					</h1>
					
					<div className='flex items-center gap-2 mt-2'>
						<div className='w-8 h-8 rounded-full overflow-hidden border border-white/10'>
							<img src={currentAlbum?.imageUrl} alt={currentAlbum?.artist} className='w-full h-full object-cover' />
						</div>
						<p className='font-body-lg text-white font-semibold'>
							{currentAlbum?.artist}
						</p>
						<span className='text-text-secondary'>• {currentAlbum?.releaseYear} • {currentAlbum?.songs.length} songs</span>
					</div>
				</div>
			</section>

			{/* Action Buttons */}
			<div className='px-6 md:px-12 py-4 flex items-center gap-6 relative'>
				<button
					onClick={handlePlayAlbum}
					className='w-16 h-16 bg-apple-red text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg'
				>
					{isAlbumPlaying ? (
						<Pause size={28} fill="currentColor" />
					) : (
						<Play size={28} fill="currentColor" className="ml-1" />
					)}
				</button>
				
				<button className='w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white transition-colors'>
					<Shuffle size={24} />
				</button>
				
				<button className='w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white transition-colors'>
					<Heart size={24} />
				</button>
				
				<button className='w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white transition-colors'>
					<MoreHorizontal size={24} />
				</button>
			</div>

			{/* Tracklist */}
			<section className='px-6 md:px-12 pb-32 pt-4'>
				<div className='flex flex-col gap-2'>
					{currentAlbum?.songs.map((song, index) => {
						const isCurrentSong = currentSong?._id === song._id;
						
						return (
							<div
								key={song._id}
								onClick={() => handlePlaySong(index)}
								className='group flex items-center py-3 px-4 rounded-xl apple-glass hover:bg-white/10 transition-all cursor-pointer'
							>
								{/* Track Number / Play Button */}
								<div className='w-10 flex-shrink-0 flex items-center justify-center text-text-secondary font-medium'>
									{isCurrentSong && isPlaying ? (
										<div className="flex gap-[2px] h-4 items-end">
											<div className="w-1 bg-apple-red h-full animate-bounce" style={{ animationDelay: '0ms' }} />
											<div className="w-1 bg-apple-red h-2/3 animate-bounce" style={{ animationDelay: '150ms' }} />
											<div className="w-1 bg-apple-red h-1/2 animate-bounce" style={{ animationDelay: '300ms' }} />
										</div>
									) : (
										<>
											<span className='group-hover:hidden'>{index + 1}</span>
											<Play size={16} fill="currentColor" className='hidden group-hover:block text-white' />
										</>
									)}
								</div>

								{/* Title & Artist */}
								<div className='flex-grow min-w-0 pr-4'>
									<p className={`text-body-lg font-medium truncate ${isCurrentSong ? 'text-apple-red' : 'text-white'}`}>
										{song.title}
									</p>
									<p className='text-body-sm text-text-secondary truncate'>
										{song.artist}
									</p>
								</div>
								
								{/* Actions */}
								<div className='w-10 flex-shrink-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
									<button className='text-text-secondary hover:text-white'>
										<Heart size={16} />
									</button>
								</div>

								{/* Duration */}
								<div className='w-12 flex-shrink-0 text-right text-text-secondary text-body-sm tabular-nums'>
									{formatDuration(song.duration)}
								</div>
							</div>
						);
					})}
				</div>
				
				<div className="mt-12 mb-8 flex flex-col gap-1">
					<p className="text-text-secondary text-body-sm font-medium">
						{new Date().getFullYear()} {currentAlbum?.artist}
					</p>
				</div>
			</section>
		</div>
	);
};

export default AlbumPage;
