import { usePlayerStore } from "@/stores/usePlayerStore";
import { useUserStore } from "@/stores/useUserStore";
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";
import LyricsView from "./LyricsView";
import { useAccentColor } from "@/hooks/useAccentColor";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, ChevronDown, ListMusic, Volume2, VolumeX, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImmersivePlayerProps {
	onClose: () => void;
}

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const ImmersivePlayer = ({ onClose }: ImmersivePlayerProps) => {
	const { currentSong, isPlaying, togglePlay, playNext, playPrevious, isShuffle, isRepeat, toggleShuffle, toggleRepeat, queue } = usePlayerStore();
	const { likedSongs, toggleLike } = useUserStore();
	const accentColor = useAccentColor(currentSong?.imageUrl);
	
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [activeTab, setActiveTab] = useState<"lyrics" | "queue">("lyrics");
	const [volume, setVolume] = useState(() => {
		const savedVolume = localStorage.getItem("playerVolume");
		return savedVolume ? parseInt(savedVolume, 10) : 75;
	});
	
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const isDraggingRef = useRef(false);

	useEffect(() => {
		audioRef.current = document.querySelector("audio");
		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => {
			if (!isDraggingRef.current) {
				setCurrentTime(audio.currentTime);
			}
		};
		const updateDuration = () => setDuration(audio.duration);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
		};
	}, []);

	if (!currentSong) return null;

	const handleSeek = (time: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = time;
			setCurrentTime(time);
		}
	};

	return (
		<motion.div 
			initial={{ y: "100%", opacity: 0, scale: 0.95 }}
			animate={{ y: 0, opacity: 1, scale: 1 }}
			exit={{ y: "100%", opacity: 0, scale: 0.95 }}
			transition={{ type: "spring", damping: 25, stiffness: 200 }}
			className='fixed inset-0 z-[100] bg-background text-white overflow-hidden flex flex-col'
		>
			{/* Ambient Gradient Background */}
			<div 
				className='absolute inset-0 opacity-40 transition-colors duration-1000 blur-[100px]'
				style={{ backgroundColor: accentColor }}
			/>
			<div className='absolute inset-0 bg-background/80 backdrop-blur-3xl' />

			{/* Top Bar */}
			<div className='relative z-10 flex items-center justify-between p-6 md:p-8'>
				<button
					onClick={onClose}
					className='w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors'
				>
					<ChevronDown size={24} />
				</button>
				
				<div className="flex bg-white/10 rounded-full p-1 border border-white/5">
					<button 
						onClick={() => setActiveTab("lyrics")}
						className={`px-6 py-2 rounded-full text-label-md font-bold transition-colors ${activeTab === "lyrics" ? "bg-white/20 text-white shadow-sm" : "text-text-secondary hover:text-white"}`}
					>
						Lyrics
					</button>
					<button 
						onClick={() => setActiveTab("queue")}
						className={`px-6 py-2 rounded-full text-label-md font-bold transition-colors ${activeTab === "queue" ? "bg-white/20 text-white shadow-sm" : "text-text-secondary hover:text-white"}`}
					>
						Playing Next
					</button>
				</div>
				
				<div className="w-10 h-10" /> {/* Spacer for centering */}
			</div>

			{/* Main Content */}
			<div className='relative z-10 flex-1 flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full px-6 md:px-12 pb-12 gap-8 lg:gap-16 h-full overflow-hidden'>
				
				{/* Left: Artwork and Controls */}
				<div className='flex-1 flex flex-col justify-center items-center lg:items-start max-w-xl mx-auto lg:mx-0 w-full h-full pb-8 lg:pb-0'>
					{/* Album Art */}
					<motion.div 
						className='w-full aspect-square max-w-[480px] mb-8 relative group rounded-2xl shadow-2xl overflow-hidden'
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.1, duration: 0.5 }}
					>
						<img
							src={currentSong.imageUrl}
							alt={currentSong.title}
							className='w-full h-full object-cover transition-transform duration-1000'
						/>
					</motion.div>

					{/* Track Info & Like */}
					<div className='w-full flex justify-between items-center mb-6 max-w-[480px]'>
						<div className="min-w-0 pr-4">
							<h1 className='text-display-sm md:text-display-md font-bold tracking-tight text-white truncate'>
								{currentSong.title}
							</h1>
							<p className='text-title-lg text-text-secondary truncate mt-1'>
								{currentSong.artist}
							</p>
						</div>
						<button 
							onClick={() => toggleLike(currentSong._id)}
							className={`transition-colors flex-shrink-0 ${likedSongs.includes(currentSong._id) ? 'text-apple-red' : 'text-text-secondary hover:text-white'}`}
						>
							<Heart size={32} fill={likedSongs.includes(currentSong._id) ? 'currentColor' : 'none'} />
						</button>
					</div>

					{/* Scrubber */}
					<div className='w-full mb-8 max-w-[480px]'>
						<Slider
							value={[currentTime]}
							max={duration || 100}
							step={1}
							className='w-full h-1.5 hover:cursor-grab active:cursor-grabbing mb-3'
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
						<div className='flex justify-between text-caption text-text-secondary font-medium tabular-nums'>
							<span>{formatTime(currentTime)}</span>
							<span>{formatTime(duration)}</span>
						</div>
					</div>

					{/* Primary Controls */}
					<div className='w-full flex items-center justify-between max-w-[480px] mb-8'>
						<button
							onClick={toggleShuffle}
							className={`transition-colors ${isShuffle ? 'text-apple-red' : 'text-text-secondary hover:text-white'}`}
						>
							<Shuffle size={24} />
						</button>

						<button
							onClick={playPrevious}
							className='text-white hover:text-apple-red active:scale-95 transition-all'
						>
							<SkipBack size={40} fill="currentColor" />
						</button>

						<button
							onClick={togglePlay}
							className='w-20 h-20 bg-apple-red text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-apple-red/20'
						>
							{isPlaying ? (
								<Pause size={36} fill="currentColor" />
							) : (
								<Play size={36} fill="currentColor" className="ml-2" />
							)}
						</button>

						<button
							onClick={playNext}
							className='text-white hover:text-apple-red active:scale-95 transition-all'
						>
							<SkipForward size={40} fill="currentColor" />
						</button>

						<button
							onClick={toggleRepeat}
							className={`transition-colors ${isRepeat ? 'text-apple-red' : 'text-text-secondary hover:text-white'}`}
						>
							<Repeat size={24} />
						</button>
					</div>
					
					{/* Volume Control (Desktop) */}
					<div className="hidden lg:flex items-center gap-3 w-full max-w-[480px]">
						<VolumeX size={16} className="text-text-secondary" />
						<Slider
							value={[volume]}
							max={100}
							step={1}
							className='flex-1'
							onValueChange={(value) => {
								setVolume(value[0]);
								localStorage.setItem("playerVolume", value[0].toString());
								if (audioRef.current) {
									audioRef.current.volume = value[0] / 100;
								}
							}}
						/>
						<Volume2 size={16} className="text-text-secondary" />
					</div>
				</div>

				{/* Right: Lyrics or Queue */}
				<div className='flex-1 h-full max-h-[800px] bg-black/20 backdrop-blur-md rounded-[40px] border border-white/5 overflow-hidden flex flex-col relative'>
					<AnimatePresence mode="wait">
						{activeTab === "lyrics" ? (
							<motion.div
								key="lyrics"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.2 }}
								className="h-full w-full absolute inset-0"
							>
								<LyricsView songId={currentSong._id} currentTime={currentTime} onSeek={handleSeek} />
							</motion.div>
						) : (
							<motion.div
								key="queue"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.2 }}
								className="h-full w-full absolute inset-0 flex flex-col p-8"
							>
								<h2 className="text-title-lg font-bold text-white mb-6">Up Next</h2>
								<div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2">
									{queue.map((song, idx) => {
										const isCurrent = currentSong._id === song._id;
										return (
											<div 
												key={song._id + idx}
												className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${isCurrent ? 'bg-white/10' : 'hover:bg-white/5'}`}
											>
												<div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
													<img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
												</div>
												<div className="flex-1 min-w-0">
													<p className={`text-body-lg font-bold truncate ${isCurrent ? 'text-apple-red' : 'text-white'}`}>{song.title}</p>
													<p className="text-body-sm text-text-secondary truncate">{song.artist}</p>
												</div>
											</div>
										)
									})}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</motion.div>
	);
};

export default ImmersivePlayer;
