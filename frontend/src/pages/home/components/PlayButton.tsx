import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";

const PlayButton = ({ song }: { song: Song }) => {
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
	const isCurrentSong = currentSong?._id === song._id;

	const handlePlay = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isCurrentSong) togglePlay();
		else setCurrentSong(song);
	};

	return (
		<div
			onClick={handlePlay}
			className={`absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-xl
				transition-all opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
				${isCurrentSong ? '!opacity-100 !translate-y-0' : ''}`}
		>
			<span
				className='material-symbols-outlined text-background'
				style={{ fontVariationSettings: "'FILL' 1" }}
			>
				{isCurrentSong && isPlaying ? 'pause' : 'play_arrow'}
			</span>
		</div>
	);
};

export default PlayButton;
