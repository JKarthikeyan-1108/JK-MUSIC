import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const getGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
};

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

	const { initializeQueue, setCurrentSong, currentSong, isPlaying, togglePlay } = usePlayerStore();

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

	const handlePlaySong = (song: any) => {
		if (currentSong?._id === song._id) {
			togglePlay();
		} else {
			setCurrentSong(song);
		}
	};

	const greeting = getGreeting();

	return (
		<div className="h-full flex flex-col bg-background overflow-hidden">
			<Topbar />

			<div className='flex-1 overflow-y-auto pb-32 w-full no-scrollbar relative'>
				{/* Ambient Header Gradient */}
				<div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-apple-red/20 via-black/5 to-transparent pointer-events-none z-0" />
				
				<div className="px-4 md:px-8 pt-6 max-w-7xl mx-auto relative z-10">
					<header className="mb-10 mt-4">
						<h1 className='text-display-lg font-bold text-white tracking-tight mb-2'>
							{greeting}
						</h1>
						<p className="text-body-lg text-text-secondary">Here's what we've been listening to.</p>
					</header>

				{/* Top Picks Grid */}
				<section className="mb-12">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-title-lg font-bold text-white">Top Picks For You</h2>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{isLoading ? (
							Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="h-24 bg-surface-container rounded-xl animate-pulse" />
							))
						) : (
							madeForYouSongs.slice(0, 6).map((song) => {
								const isCurrent = currentSong?._id === song._id;
								return (
									<div 
										key={song._id} 
										onClick={() => handlePlaySong(song)}
										className="apple-glass rounded-xl flex items-center p-3 gap-4 hover:bg-white/10 transition-colors cursor-pointer group relative"
									>
										<div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
											<img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
											<div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
												{isCurrent && isPlaying ? (
													<span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
												) : (
													<Play size={20} fill="white" className="text-white ml-1" />
												)}
											</div>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-body-lg font-bold text-white truncate">{song.title}</p>
											<p className="text-body-sm text-text-secondary truncate">{song.artist}</p>
										</div>
									</div>
								)
							})
						)}
					</div>
				</section>

				{/* Featured/Hero Carousel */}
				<section className="mb-12">
					<h2 className="text-title-lg font-bold text-white mb-4">New Releases</h2>
					<div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 snap-x">
						{isLoading ? (
							Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="min-w-[85vw] md:min-w-[600px] h-[300px] bg-surface-container rounded-2xl animate-pulse flex-shrink-0" />
							))
						) : (
							featuredSongs.map((song) => {
								const isCurrent = currentSong?._id === song._id;
								return (
									<div 
										key={song._id} 
										className="min-w-[85vw] md:min-w-[600px] h-[300px] rounded-2xl overflow-hidden relative group cursor-pointer snap-start flex-shrink-0"
										onClick={() => handlePlaySong(song)}
									>
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
										<img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
										
										<div className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between">
											<div>
												<p className="text-apple-red font-bold text-label-md uppercase tracking-wider mb-2">Featured</p>
												<h3 className="text-display-sm font-bold text-white leading-tight mb-1">{song.title}</h3>
												<p className="text-body-lg text-text-secondary">{song.artist}</p>
											</div>
											
											<button className={`w-12 h-12 rounded-full bg-apple-red text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${isCurrent && isPlaying ? 'scale-100' : 'scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'}`}>
												{isCurrent && isPlaying ? (
													<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
												) : (
													<Play size={20} fill="currentColor" className="ml-1" />
												)}
											</button>
										</div>
									</div>
								)
							})
						)}
					</div>
				</section>

				{/* Trending Carousel */}
				<section className="mb-12">
					<h2 className="text-title-lg font-bold text-white mb-4">Trending Now</h2>
					<div className="flex gap-5 overflow-x-auto no-scrollbar pb-6 snap-x">
						{isLoading ? (
							Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="min-w-[160px] md:min-w-[200px] flex-shrink-0">
									<div className="aspect-square bg-surface-container rounded-xl animate-pulse mb-3" />
									<div className="h-4 bg-surface-container rounded w-3/4 mb-1 animate-pulse" />
									<div className="h-3 bg-surface-container rounded w-1/2 animate-pulse" />
								</div>
							))
						) : (
							trendingSongs.map((song) => {
								const isCurrent = currentSong?._id === song._id;
								return (
									<div 
										key={song._id} 
										className="min-w-[160px] md:min-w-[200px] flex-shrink-0 group cursor-pointer snap-start"
										onClick={() => handlePlaySong(song)}
									>
										<div className="aspect-square rounded-xl overflow-hidden mb-3 relative shadow-lg">
											<img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
											<div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
												<button className="w-12 h-12 rounded-full bg-apple-red text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
													{isCurrent && isPlaying ? (
														<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
													) : (
														<Play size={20} fill="currentColor" className="ml-1" />
													)}
												</button>
											</div>
										</div>
										<h4 className="text-body-lg font-bold text-white truncate">{song.title}</h4>
										<p className="text-body-sm text-text-secondary truncate">{song.artist}</p>
									</div>
								)
							})
						)}
					</div>
				</section>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
