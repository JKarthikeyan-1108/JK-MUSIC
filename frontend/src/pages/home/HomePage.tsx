import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {
	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
	} = useMusicStore();

	const { initializeQueue } = usePlayerStore();

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

	return (
		<>
			<Topbar />

			{/* Hero/Featured Gradient Area */}
			<div className='px-lg pt-md'>
				<FeaturedSection />
			</div>

			{/* Bento Grid: Made for You */}
			<section className='mt-xl px-lg'>
				<SectionGrid title='Made for You' songs={madeForYouSongs} isLoading={isLoading} />
			</section>

			{/* Trending Carousel Section */}
			<section className='mt-xl'>
				<div className='px-lg flex justify-between items-end mb-md'>
					<h3 className='font-title-md text-title-md text-on-surface'>Trending Now</h3>
					<div className='flex gap-sm'>
						<button className='w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface'>
							<span className='material-symbols-outlined'>chevron_left</span>
						</button>
						<button className='w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface'>
							<span className='material-symbols-outlined'>chevron_right</span>
						</button>
					</div>
				</div>
				<div className='flex gap-gutter overflow-x-auto px-lg no-scrollbar pb-lg'>
					{trendingSongs.map((song) => (
						<div key={song._id} className='min-w-[200px] md:min-w-[240px] group cursor-pointer'
							onClick={() => usePlayerStore.getState().setCurrentSong(song)}
						>
							<div className='relative aspect-square rounded-lg overflow-hidden mb-md shadow-2xl'>
								<img
									src={song.imageUrl}
									alt={song.title}
									className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
								/>
								<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
									<div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform'>
										<span className='material-symbols-outlined text-background text-[32px]' style={{ fontVariationSettings: "'FILL' 1" }}>
											play_arrow
										</span>
									</div>
								</div>
							</div>
							<h4 className='font-title-md text-body-lg text-on-surface'>{song.title}</h4>
							<p className='font-body-sm text-body-sm text-on-surface-variant'>{song.artist}</p>
						</div>
					))}
				</div>
			</section>
		</>
	);
};

export default HomePage;
