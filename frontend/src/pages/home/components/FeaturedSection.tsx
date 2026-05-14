import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";

const FeaturedSection = () => {
	const { isLoading, featuredSongs, error } = useMusicStore();
	const { setCurrentSong, currentSong, isPlaying, togglePlay } = usePlayerStore();

	if (isLoading) {
		return (
			<div className='relative w-full h-[340px] rounded-xl overflow-hidden bg-surface-container-high animate-pulse' />
		);
	}

	if (error) return <p className='text-error mb-md text-body-lg'>{error}</p>;

	const heroSong = featuredSongs[0];
	if (!heroSong) return null;

	const isHeroPlaying = currentSong?._id === heroSong._id && isPlaying;

	const handlePlayHero = () => {
		if (currentSong?._id === heroSong._id) togglePlay();
		else setCurrentSong(heroSong);
	};

	return (
		<div className='relative w-full h-[340px] rounded-xl overflow-hidden group cursor-pointer' onClick={handlePlayHero}>
			{/* Gradient overlays */}
			<div className='absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20 z-10' />
			<div className='absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-transparent z-10' />

			{/* Image */}
			<img
				src={heroSong.imageUrl}
				alt={heroSong.title}
				className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
			/>

			{/* Content */}
			<div className='absolute bottom-lg left-lg z-20 space-y-md'>
				<div className='flex items-center gap-xs text-primary'>
					<span className='material-symbols-outlined text-[18px]' style={{ fontVariationSettings: "'FILL' 1" }}>
						verified
					</span>
					<span className='font-label-md text-label-md uppercase tracking-widest'>Featured</span>
				</div>
				<h2 className='font-display-lg text-display-lg text-on-surface'>
					{heroSong.title}
				</h2>
				<p className='text-on-surface-variant font-body-lg max-w-xl'>
					{heroSong.artist}
				</p>
				<div className='flex items-center gap-md'>
					<button className='bg-primary text-background px-xl py-md rounded-full font-bold flex items-center gap-sm hover:scale-105 active:scale-95 transition-all'>
						<span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>
							{isHeroPlaying ? 'pause' : 'play_arrow'}
						</span>
						{isHeroPlaying ? 'Pause' : 'Play Now'}
					</button>
					<button className='border border-outline text-on-surface px-xl py-md rounded-full font-bold hover:bg-on-surface/10 transition-all'>
						Follow
					</button>
				</div>
			</div>
		</div>
	);
};

export default FeaturedSection;
