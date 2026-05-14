import { usePlayerStore } from "@/stores/usePlayerStore";
import { useUserStore } from "@/stores/useUserStore";
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";

interface ImmersivePlayerProps {
	onClose: () => void;
}

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Mock lyrics since we don't have a lyrics API
const MOCK_LYRICS = [
	"Yeah, you're lookin' at the truth",
	"The money never lie, no",
	"I'm the one, yeah, I'm the one",
	"Early mornin' in the dawn",
	"Know you wanna ride now",
	"I'm the one, yeah, I'm the one",
	"Yeah, you're sick of all those other imitators",
	"Don't let the only real one intimidate ya",
	"See you watchin', don't run outta time now",
];

const ImmersivePlayer = ({ onClose }: ImmersivePlayerProps) => {
	const { currentSong, isPlaying, togglePlay, playNext, playPrevious, isShuffle, isRepeat, toggleShuffle, toggleRepeat, toggleQueue } = usePlayerStore();
	const { likedSongs, toggleLike } = useUserStore();
	
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
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

	return (
		<div className='fixed inset-0 z-[100] bg-background text-on-surface overflow-hidden flex flex-col'>
			{/* Ambient Gradient Background based on album art (simulated with CSS variables or fixed gradient for now) */}
			<div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10 opacity-80' />
			<div className='absolute inset-0 backdrop-blur-3xl' />

			{/* Top Bar */}
			<div className='relative z-10 flex items-center justify-between p-lg'>
				<button
					onClick={onClose}
					className='w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors'
				>
					<span className='material-symbols-outlined text-[32px]'>expand_more</span>
				</button>
				<div className='text-center'>
					<p className='font-label-sm text-label-sm text-on-surface-variant tracking-widest uppercase'>
						PLAYING FROM ALBUM
					</p>
					<h3 className='font-title-md text-title-md font-bold'>{currentSong.albumId || 'Melodix Premium'}</h3>
				</div>
				<button className='w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors'>
					<span className='material-symbols-outlined text-[28px]'>more_horiz</span>
				</button>
			</div>

			{/* Main Content Split */}
			<div className='relative z-10 flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-lg lg:px-xl pb-xl gap-xl'>
				
				{/* Left: Artwork and Controls */}
				<div className='flex-1 flex flex-col justify-center items-center lg:items-start max-w-xl mx-auto lg:mx-0 w-full'>
					{/* Album Art Container with Glassmorphism */}
					<div className='w-full aspect-square max-w-[500px] mb-xl relative group'>
						<div className='absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-90 group-hover:scale-100 transition-transform duration-1000' />
						<img
							src={currentSong.imageUrl}
							alt={currentSong.title}
							className='w-full h-full object-cover rounded-2xl shadow-2xl relative z-10'
						/>
					</div>

					{/* Track Info */}
					<div className='w-full flex justify-between items-end mb-lg px-md lg:px-0'>
						<div>
							<h1 className='font-display-sm text-[36px] font-extrabold tracking-tighter mb-xs'>
								{currentSong.title}
							</h1>
							<p className='font-title-md text-title-md text-on-surface-variant'>
								{currentSong.artist}
							</p>
						</div>
						<button 
							onClick={() => toggleLike(currentSong._id)}
							className={`transition-colors ${likedSongs.includes(currentSong._id) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
						>
							<span className='material-symbols-outlined text-[32px]' style={likedSongs.includes(currentSong._id) ? { fontVariationSettings: "'FILL' 1" } : undefined}>
								favorite
							</span>
						</button>
					</div>

					{/* Scrubber */}
					<div className='w-full mb-lg px-md lg:px-0'>
						<Slider
							value={[currentTime]}
							max={duration || 100}
							step={1}
							className='w-full h-2 hover:cursor-grab active:cursor-grabbing mb-sm'
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
						<div className='flex justify-between font-label-md text-label-md text-on-surface-variant'>
							<span>{formatTime(currentTime)}</span>
							<span>{formatTime(duration)}</span>
						</div>
					</div>

					{/* Primary Controls */}
					<div className='w-full flex items-center justify-between px-md lg:px-0'>
						<button
							onClick={toggleShuffle}
							className={`transition-colors ${isShuffle ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
						>
							<span className='material-symbols-outlined text-[28px]'>shuffle</span>
						</button>

						<button
							onClick={playPrevious}
							className='text-on-surface hover:text-primary active:scale-95 transition-all'
						>
							<span className='material-symbols-outlined text-[48px]' style={{ fontVariationSettings: "'FILL' 1" }}>
								skip_previous
							</span>
						</button>

						<button
							onClick={togglePlay}
							className='w-20 h-20 bg-primary text-background rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20'
						>
							<span className='material-symbols-outlined text-[48px]' style={{ fontVariationSettings: "'FILL' 1" }}>
								{isPlaying ? 'pause' : 'play_arrow'}
							</span>
						</button>

						<button
							onClick={playNext}
							className='text-on-surface hover:text-primary active:scale-95 transition-all'
						>
							<span className='material-symbols-outlined text-[48px]' style={{ fontVariationSettings: "'FILL' 1" }}>
								skip_next
							</span>
						</button>

						<button
							onClick={toggleRepeat}
							className={`transition-colors ${isRepeat ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
						>
							<span className='material-symbols-outlined text-[28px]'>repeat</span>
						</button>
					</div>
				</div>

				{/* Right: Lyrics / Queue Split */}
				<div className='hidden lg:flex flex-1 flex-col gap-lg h-full max-h-[800px]'>
					{/* Lyrics Card */}
					<div className='flex-1 bg-surface-container/40 backdrop-blur-md rounded-3xl p-xl border border-outline-variant/20 overflow-hidden relative group'>
						<div className='absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-surface-container/90 to-transparent z-10 pointer-events-none' />
						<div className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-surface-container/90 to-transparent z-10 pointer-events-none' />
						
						<div className='flex justify-between items-center mb-lg relative z-20'>
							<h3 className='font-title-lg text-title-lg font-bold'>Lyrics</h3>
							<button className='w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition-colors'>
								<span className='material-symbols-outlined text-[20px]'>open_in_full</span>
							</button>
						</div>

						<div className='overflow-y-auto no-scrollbar h-full pb-20 relative z-0 mask-image-linear'>
							{MOCK_LYRICS.map((line, i) => (
								<p
									key={i}
									className={`font-display-sm text-[28px] font-bold mb-md leading-tight transition-colors duration-300 ${
										i === 3 ? 'text-on-surface' : 'text-on-surface-variant/40 hover:text-on-surface-variant/80'
									}`}
								>
									{line}
								</p>
							))}
						</div>
					</div>

					{/* Up Next Card */}
					<div className='h-1/3 bg-surface-container/40 backdrop-blur-md rounded-3xl p-xl border border-outline-variant/20 flex flex-col'>
						<div className='flex justify-between items-center mb-md'>
							<h3 className='font-title-lg text-title-lg font-bold'>Up Next</h3>
							<button onClick={() => { toggleQueue(); onClose(); }} className='text-on-surface-variant hover:text-on-surface text-label-md font-bold uppercase'>View Queue</button>
						</div>
						<div className='flex-1 flex items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-2xl'>
							<p className='text-on-surface-variant font-body-lg'>Add songs to queue</p>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
};

export default ImmersivePlayer;
