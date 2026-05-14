import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef, useState } from "react";
import ImmersivePlayer from "./ImmersivePlayer";
import QueuePanel from "./QueuePanel";
import { useUserStore } from "@/stores/useUserStore";

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
			<footer className='fixed bottom-0 left-0 right-0 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant p-md z-50'>
				<div className='flex items-center justify-between gap-xl'>
				{/* Track Info */}
				<div className='flex items-center gap-md min-w-0 flex-1'>
					{currentSong ? (
						<>
							<div className='w-14 h-14 rounded-lg overflow-hidden shrink-0'>
								<img
									src={currentSong.imageUrl}
									alt={currentSong.title}
									className='w-full h-full object-cover'
								/>
							</div>
							<div className='min-w-0 hidden sm:block'>
								<h5 className='text-body-lg font-bold text-on-surface truncate'>
									{currentSong.title}
								</h5>
								<p className='text-body-sm text-on-surface-variant truncate'>
									{currentSong.artist}
								</p>
							</div>
							<div className='hidden sm:flex items-center gap-2 ml-md'>
								<button 
									onClick={() => toggleLike(currentSong._id)}
									className={`transition-colors ${likedSongs.includes(currentSong._id) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
								>
									<span className='material-symbols-outlined text-[20px]' style={likedSongs.includes(currentSong._id) ? { fontVariationSettings: "'FILL' 1" } : undefined}>
										favorite
									</span>
								</button>
								<button 
									onClick={() => setIsExpanded(true)}
									className='text-on-surface-variant hover:text-on-surface transition-colors'
									title='Expand Player'
								>
									<span className='material-symbols-outlined text-[20px]'>open_in_full</span>
								</button>
							</div>
						</>
					) : (
						<div className='w-14 h-14 rounded-lg bg-surface-container-high shrink-0' />
					)}
				</div>

				{/* Controls */}
				<div className='flex flex-col items-center gap-xs flex-1 max-w-2xl'>
					<div className='flex items-center gap-lg'>
						<button
							onClick={toggleShuffle}
							className={`hidden sm:block transition-colors ${isShuffle ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
						>
							<span className='material-symbols-outlined'>shuffle</span>
						</button>

						<button
							onClick={playPrevious}
							disabled={!currentSong}
							className='text-on-surface hover:text-primary disabled:opacity-40'
						>
							<span className='material-symbols-outlined text-[28px]' style={{ fontVariationSettings: "'FILL' 1" }}>
								skip_previous
							</span>
						</button>

						<button
							onClick={togglePlay}
							disabled={!currentSong}
							className='w-10 h-10 bg-on-surface rounded-full flex items-center justify-center text-background hover:scale-105 transition-transform disabled:opacity-40'
						>
							<span className='material-symbols-outlined text-[32px]' style={{ fontVariationSettings: "'FILL' 1" }}>
								{isPlaying ? 'pause' : 'play_arrow'}
							</span>
						</button>

						<button
							onClick={playNext}
							disabled={!currentSong}
							className='text-on-surface hover:text-primary disabled:opacity-40'
						>
							<span className='material-symbols-outlined text-[28px]' style={{ fontVariationSettings: "'FILL' 1" }}>
								skip_next
							</span>
						</button>

						<button
							onClick={toggleRepeat}
							className={`hidden sm:block transition-colors ${isRepeat ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
						>
							<span className='material-symbols-outlined'>repeat</span>
						</button>
					</div>

					<div className='w-full hidden sm:flex items-center gap-sm px-lg'>
						<span className='text-label-md font-label-md text-on-surface-variant'>
							{formatTime(currentTime)}
						</span>
						<Slider
							value={[currentTime]}
							max={duration || 100}
							step={1}
							className='flex-1 hover:cursor-grab active:cursor-grabbing'
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
						<span className='text-label-md font-label-md text-on-surface-variant'>
							{formatTime(duration)}
						</span>
					</div>
				</div>

				{/* Volume & Extra */}
				<div className='hidden lg:flex items-center justify-end gap-md flex-1'>
					<span className='material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface'>
						mic_external_on
					</span>
					<button onClick={toggleQueue} className={`transition-colors ${isQueueOpen ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
						<span className='material-symbols-outlined'>
							queue_music
						</span>
					</button>
					<span className='material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface'>
						devices
					</span>
					<div className='flex items-center gap-sm w-32'>
						<button onClick={toggleMute}>
							<span className='material-symbols-outlined text-on-surface-variant'>
								{volume === 0 ? 'volume_off' : 'volume_up'}
							</span>
						</button>
						<Slider
							value={[volume]}
							max={100}
							step={1}
							className='flex-1 hover:cursor-grab active:cursor-grabbing'
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
			</div>
			</footer>
		</>
	);
};
