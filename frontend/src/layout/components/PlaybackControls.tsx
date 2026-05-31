import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef, useState } from "react";
import ImmersivePlayer from "./ImmersivePlayer";
import QueuePanel from "./QueuePanel";
import { useUserStore } from "@/stores/useUserStore";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ListMusic, AlignLeft, Airplay, Volume2, VolumeX, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
	const { currentSong, isPlaying, togglePlay, playNext, playPrevious, isShuffle, isRepeat, toggleShuffle, toggleRepeat, isQueueOpen, toggleQueue } = usePlayerStore();
	const { likedSongs, toggleLike } = useUserStore();
	const [isExpanded, setIsExpanded] = useState(false);

	const [volume, setVolume] = useState(() => {
		const savedVolume = localStorage.getItem("playerVolume");
		return savedVolume ? parseInt(savedVolume, 10) : 75;
	});
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const isDraggingRef = useRef(false);
	const prevVolumeRef = useRef(volume);

	// Animation keys
	const songKey = currentSong?._id || "none";

	useEffect(() => {
		audioRef.current = document.querySelector("audio");
		const audio = audioRef.current;
		if (!audio) return;

		audio.volume = volume / 100;

		const updateTime = () => {
			if (!isDraggingRef.current) {
				setCurrentTime(audio.currentTime);
			}
		};
		const updateDuration = () => setDuration(audio.duration);
		const handleEnded = () => {
			usePlayerStore.setState({ isPlaying: false });
		};

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);
		audio.addEventListener("ended", handleEnded);

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "Space" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
				e.preventDefault();
				togglePlay();
			}
		};
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [currentSong, isPlaying, volume, togglePlay]);

	const toggleMute = () => {
		if (volume === 0) {
			setVolume(prevVolumeRef.current || 75);
			if (audioRef.current) audioRef.current.volume = (prevVolumeRef.current || 75) / 100;
		} else {
			prevVolumeRef.current = volume;
			setVolume(0);
			if (audioRef.current) audioRef.current.volume = 0;
		}
	};

	return (
		<>
			{isExpanded && <ImmersivePlayer onClose={() => setIsExpanded(false)} />}
			{isQueueOpen && <QueuePanel onClose={toggleQueue} />}
			<footer className='fixed bottom-0 md:bottom-0 left-0 right-0 h-[68px] md:h-[80px] apple-glass-strong border-t border-separator z-50 transition-all'>
				<div className='flex items-center justify-between h-full px-4 md:px-6'>
					{/* Track Info */}
					<div className='flex items-center gap-3 md:gap-4 min-w-0 flex-1 h-full' onClick={() => window.innerWidth < 768 && setIsExpanded(true)}>
						<AnimatePresence mode="wait">
							{currentSong ? (
								<motion.div
									key={songKey}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.3 }}
									className="flex items-center gap-3 w-full"
								>
									<motion.div 
										className='w-12 h-12 md:w-14 md:h-14 rounded-card overflow-hidden shrink-0 shadow-lg cursor-pointer'
										whileHover={{ scale: 1.05 }}
										onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
										initial={{ scale: 0.8 }}
										animate={{ scale: 1 }}
										transition={{ type: "spring", stiffness: 300, damping: 20 }}
									>
										<img
											src={currentSong.imageUrl}
											alt={currentSong.title}
											className='w-full h-full object-cover'
											crossOrigin="anonymous"
										/>
									</motion.div>
									<div className='min-w-0 flex-1 md:flex-none'>
										<h5 className='text-body-md md:text-title-sm font-semibold text-white truncate'>
											{currentSong.title}
										</h5>
										<p className='text-caption text-text-secondary truncate'>
											{currentSong.artist}
										</p>
									</div>
									<div className='hidden md:flex items-center ml-2'>
										<button 
											onClick={(e) => { e.stopPropagation(); toggleLike(currentSong._id); }}
											className={`transition-colors p-2 rounded-full hover:bg-white/5 ${likedSongs.includes(currentSong._id) ? 'text-apple-red' : 'text-text-secondary hover:text-white'}`}
										>
											<Heart size={20} fill={likedSongs.includes(currentSong._id) ? 'currentColor' : 'none'} />
										</button>
									</div>
								</motion.div>
							) : (
								<div className='w-12 h-12 md:w-14 md:h-14 rounded-card bg-white/5 shrink-0' />
							)}
						</AnimatePresence>
					</div>

					{/* Center Controls */}
					<div className='hidden md:flex flex-col items-center justify-center gap-2 flex-1 max-w-[480px] h-full'>
						<div className='flex items-center gap-6'>
							<button
								onClick={toggleShuffle}
								className={`transition-colors ${isShuffle ? 'text-apple-red' : 'text-text-secondary hover:text-white'}`}
							>
								<Shuffle size={20} />
							</button>

							<button
								onClick={playPrevious}
								disabled={!currentSong}
								className='text-text-secondary hover:text-white disabled:opacity-40 transition-colors'
							>
								<SkipBack size={24} fill="currentColor" />
							</button>

							<button
								onClick={togglePlay}
								disabled={!currentSong}
								className='w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-40'
							>
								{isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
							</button>

							<button
								onClick={playNext}
								disabled={!currentSong}
								className='text-text-secondary hover:text-white disabled:opacity-40 transition-colors'
							>
								<SkipForward size={24} fill="currentColor" />
							</button>

							<button
								onClick={toggleRepeat}
								className={`transition-colors ${isRepeat ? 'text-apple-red' : 'text-text-secondary hover:text-white'}`}
							>
								<Repeat size={20} />
							</button>
						</div>

						<div className='w-full flex items-center gap-3'>
							<span className='text-caption text-text-tertiary w-10 text-right'>
								{formatTime(currentTime)}
							</span>
							<Slider
								value={[currentTime]}
								max={duration || 100}
								step={1}
								className='flex-1 hover:cursor-pointer'
								onValueChange={(value) => {
									setCurrentTime(value[0]);
									isDraggingRef.current = true;
								}}
								onValueCommit={(value) => {
									if (audioRef.current) {
										audioRef.current.currentTime = value[0];
									}
									isDraggingRef.current = false;
								}}
							/>
							<span className='text-caption text-text-tertiary w-10'>
								{duration ? formatTime(duration) : "-:--"}
							</span>
						</div>
					</div>

					{/* Right Controls */}
					<div className='hidden lg:flex items-center justify-end gap-4 flex-1 h-full'>
						<button onClick={() => setIsExpanded(true)} className='text-text-secondary hover:text-white transition-colors'>
							<AlignLeft size={18} />
						</button>
						<button onClick={toggleQueue} className={`transition-colors ${isQueueOpen ? 'text-apple-red' : 'text-text-secondary hover:text-white'}`}>
							<ListMusic size={18} />
						</button>
						<button className='text-text-secondary hover:text-white transition-colors'>
							<Airplay size={18} />
						</button>
						<div className='flex items-center gap-2 w-32 group'>
							<button onClick={toggleMute} className='text-text-secondary group-hover:text-white transition-colors'>
								{volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
							</button>
							<Slider
								value={[volume]}
								max={100}
								step={1}
								className='flex-1 hover:cursor-pointer'
								onValueChange={(value) => {
									setVolume(value[0]);
									localStorage.setItem("playerVolume", value[0].toString());
									if (audioRef.current) {
										audioRef.current.volume = value[0] / 100;
									}
								}}
							/>
						</div>
					</div>
					
					{/* Mobile Play Button */}
					<div className='md:hidden flex items-center shrink-0'>
						<button
							onClick={(e) => { e.stopPropagation(); togglePlay(); }}
							disabled={!currentSong}
							className='w-10 h-10 flex items-center justify-center text-white active:scale-95 transition-all disabled:opacity-40'
						>
							{isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
						</button>
					</div>
				</div>
			</footer>
		</>
	);
};
