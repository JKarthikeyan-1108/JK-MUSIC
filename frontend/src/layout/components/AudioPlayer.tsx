import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const { currentSong, isPlaying, playNext } = usePlayerStore();

	// handle play/pause logic
	useEffect(() => {
		if (!audioRef.current) return;
		const targetVol = parseInt(localStorage.getItem("playerVolume") || "75", 10) / 100;
		if (isPlaying) {
			audioRef.current.volume = targetVol;
			audioRef.current.play();
		} else {
			audioRef.current.pause();
		}
	}, [isPlaying]);

	// handle song ends
	useEffect(() => {
		const audio = audioRef.current;

		const handleEnded = () => {
			playNext();
		};

		audio?.addEventListener("ended", handleEnded);

		return () => audio?.removeEventListener("ended", handleEnded);
	}, [playNext]);

	// handle song changes with fake crossfade
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;
		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
		
		if (isSongChange) {
			const targetVol = parseInt(localStorage.getItem("playerVolume") || "75", 10) / 100;
			
			const playNewSong = () => {
				audio.src = currentSong.audioUrl;
				audio.currentTime = 0;
				prevSongRef.current = currentSong.audioUrl;
				
				if (isPlaying) {
					audio.volume = 0;
					audio.play().then(() => {
						// Fade in over 1s
						let vol = 0;
						const step = targetVol / 20;
						const interval = setInterval(() => {
							vol = Math.min(targetVol, vol + step);
							if (audio) audio.volume = vol;
							if (vol >= targetVol) clearInterval(interval);
						}, 50);
					}).catch(console.error);
				} else {
					audio.volume = targetVol;
				}
			};

			if (isPlaying && !audio.paused && audio.src) {
				// Fade out current song over 1s
				let vol = audio.volume;
				const step = vol / 20;
				const interval = setInterval(() => {
					vol = Math.max(0, vol - step);
					if (audio) audio.volume = vol;
					if (vol <= 0) {
						clearInterval(interval);
						playNewSong();
					}
				}, 50);
			} else {
				playNewSong();
			}
		}
	}, [currentSong, isPlaying]);

	return <audio ref={audioRef} />;
};
export default AudioPlayer;
