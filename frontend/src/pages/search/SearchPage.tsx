import Topbar from "@/components/Topbar";
import SettingsModal from "@/components/SettingsModal";
import { useState } from "react";
import { Search, Bell, Settings } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const CATEGORIES = [
	{
		id: "pop",
		title: "Pop",
		color: "from-fuchsia-500/80 to-purple-500/40",
		textColor: "text-white",
		image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
		colSpan: "col-span-2 md:col-span-2",
		isTrending: true,
	},
	{
		id: "hiphop",
		title: "Hip-Hop",
		color: "from-orange-500/80 to-red-500/30",
		textColor: "text-white",
		image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=600&auto=format&fit=crop",
		colSpan: "col-span-1 md:col-span-1",
	},
	{
		id: "rock",
		title: "Rock",
		color: "from-rose-600/80 to-pink-500/30",
		textColor: "text-white",
		image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600&auto=format&fit=crop",
		colSpan: "col-span-1 md:col-span-1",
	},
	{
		id: "electronic",
		title: "Electronic",
		color: "from-blue-500/60 to-cyan-500/40",
		textColor: "text-white",
		image: "https://images.unsplash.com/photo-1514315384763-ba401779410f?q=80&w=600&auto=format&fit=crop",
		colSpan: "col-span-1 md:col-span-1",
	},
	{
		id: "jazz",
		title: "Jazz",
		color: "from-amber-600/70 to-yellow-500/20",
		textColor: "text-white",
		image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop",
		colSpan: "col-span-1 md:col-span-1",
	},
	{
		id: "latin",
		title: "Latin",
		color: "from-emerald-500/60 to-teal-400/20",
		textColor: "text-white",
		image: "https://images.unsplash.com/photo-1469504512102-900f29606341?q=80&w=600&auto=format&fit=crop",
		colSpan: "col-span-2 md:col-span-2",
		isLargeText: true,
	},
	{
		id: "chill",
		title: "Chill",
		color: "from-sky-400/80 to-blue-600/30",
		textColor: "text-white",
		image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
		colSpan: "col-span-1 md:col-span-1",
	},
	{
		id: "focus",
		title: "Focus",
		color: "from-indigo-500/80 to-violet-500/20",
		textColor: "text-white",
		image: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=600&auto=format&fit=crop",
		colSpan: "col-span-1 md:col-span-1",
	},
];

const MOODS = [
	{
		id: "morning",
		title: "Morning Coffee Acoustic",
		subtitle: "Start your day with a gentle selection of curated acoustic tracks.",
		label: "FOR YOU",
		labelColor: "text-apple-red",
		glowColor: "bg-apple-red/10 group-hover:bg-apple-red/20",
		image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=300&auto=format&fit=crop",
	},
	{
		id: "night",
		title: "Synthwave Cityscapes",
		subtitle: "The ultimate companion for your late-night urban drives.",
		label: "CURATED",
		labelColor: "text-blue-400",
		glowColor: "bg-blue-500/10 group-hover:bg-blue-500/20",
		image: "https://images.unsplash.com/photo-1555626906-fcf10d6851b4?q=80&w=300&auto=format&fit=crop",
	},
];

const SearchPage = () => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const { user } = useUser();

	return (
		<div className="h-full flex flex-col bg-background overflow-hidden relative">
			{/* Ambient Header Gradient */}
			<div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-apple-red/10 via-black/5 to-transparent pointer-events-none z-0" />
			
			{/* Custom TopBar for Search */}
			<header className='bg-background/40 backdrop-blur-xl sticky top-0 z-40 w-full flex justify-between items-center px-4 md:px-8 py-4 transition-all border-b border-white/5'>
				<div className='flex items-center gap-4 flex-grow max-w-2xl'>
					<div className='relative w-full group'>
						<Search className='absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-apple-red transition-colors' size={20} />
						<input
							type='text'
							placeholder='What do you want to listen to?'
							className='w-full apple-glass border-none rounded-full py-3 pl-12 pr-4 text-white placeholder:text-text-secondary focus:ring-2 focus:ring-apple-red transition-all font-body-lg text-body-lg shadow-lg'
						/>
					</div>
				</div>
				<div className='flex items-center gap-3 ml-6'>
					<button className='p-2 rounded-full hover:bg-white/10 text-text-secondary hover:text-white transition-colors active:scale-95 hidden sm:block'>
						<Bell size={20} />
					</button>
					<button onClick={() => setIsSettingsOpen(true)} className='p-2 rounded-full hover:bg-white/10 text-text-secondary hover:text-white transition-colors active:scale-95 hidden sm:block'>
						<Settings size={20} />
					</button>
					<div className='w-10 h-10 rounded-full overflow-hidden border border-white/10 ml-2 hover:ring-2 hover:ring-apple-red transition-all cursor-pointer'>
						<img
							src={user?.imageUrl || "/avatar.png"}
							alt='User profile'
							className='w-full h-full object-cover'
						/>
					</div>
				</div>
			</header>

			{/* Search Content */}
			<div className='flex-1 overflow-y-auto px-4 md:px-8 pb-32 pt-6 max-w-7xl mx-auto w-full no-scrollbar'>
				<section className='mb-12'>
					<h2 className='text-display-sm font-bold text-white mb-6 tracking-tight'>Browse All</h2>

					{/* Genre Grid (Asymmetric Bento Style) */}
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
						{CATEGORIES.map((category) => (
							<div
								key={category.id}
								className={`${category.colSpan} relative h-48 md:h-56 rounded-2xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300`}
							>
								<div className={`absolute inset-0 bg-gradient-to-br ${category.color} z-10 opacity-80 group-hover:opacity-90 transition-opacity`} />
								<img
									src={category.image}
									alt={category.title}
									className='absolute inset-0 w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-700'
								/>
								<div className={`relative z-20 p-6 flex flex-col ${category.isTrending ? 'justify-between' : 'justify-end'} h-full`}>
									{category.isTrending ? (
										<>
											<span className={`text-display-sm md:text-display-md ${category.textColor} font-extrabold -rotate-3 origin-left drop-shadow-lg`}>
												{category.title}
											</span>
											<div className='opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300'>
												<span className='apple-glass px-3 py-1 rounded-full text-white font-bold text-label-md'>
													Trending Now
												</span>
											</div>
										</>
									) : (
										<span className={`${category.isLargeText ? 'text-title-lg md:text-display-sm font-extrabold' : 'text-title-md md:text-title-lg font-bold'} ${category.textColor} drop-shadow-md`}>
											{category.title}
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				</section>

				<section className='mb-12'>
					<h2 className='text-display-sm font-bold text-white mb-6 tracking-tight'>Mood-Based Discovery</h2>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'>
						{MOODS.map((mood) => (
							<div
								key={mood.id}
								className='group relative p-4 md:p-6 rounded-2xl apple-glass overflow-hidden hover:bg-white/10 transition-all cursor-pointer border border-white/5'
							>
								<div className='flex flex-col sm:flex-row gap-4 md:gap-6 relative z-10'>
									<div className='w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden shadow-2xl flex-shrink-0'>
										<img
											src={mood.image}
											alt={mood.title}
											className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
										/>
									</div>
									<div className='flex flex-col justify-center'>
										<span className={`font-bold text-label-md ${mood.labelColor} mb-1 tracking-wider`}>{mood.label}</span>
										<h3 className='text-title-lg font-bold text-white mb-2 leading-tight'>{mood.title}</h3>
										<p className='text-body-md text-text-secondary max-w-sm'>
											{mood.subtitle}
										</p>
									</div>
								</div>
								<div className={`absolute -right-8 -bottom-8 w-40 h-40 ${mood.glowColor} blur-3xl transition-all rounded-full`} />
							</div>
						))}
					</div>
				</section>
			</div>

			{isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
		</div>
	);
};

export default SearchPage;
