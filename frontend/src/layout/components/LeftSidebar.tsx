import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn } from "@clerk/clerk-react";
import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, Compass, Radio, Clock, Heart, ListMusic, MessageSquare, Music } from "lucide-react";
import { motion } from "framer-motion";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
	const location = useLocation();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	const navItems = [
		{ to: "/", icon: Home, label: "Home" },
		{ to: "/search", icon: Search, label: "Search" },
		{ to: "/browse", icon: Compass, label: "Browse" },
		{ to: "/radio", icon: Radio, label: "Radio" },
	];

	return (
		<aside className='hidden md:flex flex-col p-4 apple-glass h-screen w-[240px] left-0 sticky shrink-0 z-10'>
			{/* Top section — Branding */}
			<div className='mb-8 px-2'>
				<div className='flex items-center gap-2 mb-1'>
					<Music className='text-apple-red' size={24} />
					<h1 className='text-display-md text-white tracking-tight'>JK Music</h1>
				</div>
				<span className='inline-block bg-apple-red/20 text-apple-red text-caption px-2 py-0.5 rounded-pill font-semibold'>
					Premium
				</span>
			</div>

			<div className='flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-6'>
				{/* Navigation section */}
				<div>
					<h2 className='text-overline text-text-tertiary px-2 mb-2'>Apple Music</h2>
					<nav className='flex flex-col gap-1'>
						{navItems.map((item) => {
							const isActive = location.pathname === item.to;
							return (
								<NavLink
									key={item.to}
									to={item.to}
									className='relative px-2 py-1.5 flex items-center gap-3 rounded-button group'
								>
									{isActive && (
										<motion.div
											layoutId="activeNav"
											className="absolute inset-0 bg-white/10 rounded-button"
											transition={{ type: "spring", stiffness: 300, damping: 30 }}
										/>
									)}
									{!isActive && (
										<div className="absolute inset-0 bg-white/5 rounded-button opacity-0 group-hover:opacity-100 transition-opacity" />
									)}
									<item.icon
										size={18}
										className={`relative z-10 ${isActive ? 'text-apple-red' : 'text-text-secondary'}`}
										strokeWidth={isActive ? 2.5 : 2}
									/>
									<span className={`relative z-10 text-body-md ${isActive ? 'text-white font-semibold' : 'text-text-secondary font-medium group-hover:text-white'}`}>
										{item.label}
									</span>
								</NavLink>
							);
						})}
					</nav>
				</div>

				{/* Library section */}
				<div>
					<h2 className='text-overline text-text-tertiary px-2 mb-2'>My Library</h2>
					<nav className='flex flex-col gap-1'>
						<NavLink to="/recently-added" className='relative px-2 py-1.5 flex items-center gap-3 rounded-button group hover:bg-white/5 transition-colors'>
							<Clock size={16} className='text-text-secondary group-hover:text-white' strokeWidth={2} />
							<span className='text-body-md text-text-secondary font-medium group-hover:text-white'>Recently Added</span>
						</NavLink>
						<SignedIn>
							<NavLink to="/library?tab=liked" className='relative px-2 py-1.5 flex items-center gap-3 rounded-button group hover:bg-white/5 transition-colors'>
								<Heart size={16} className='text-text-secondary group-hover:text-white' strokeWidth={2} />
								<span className='text-body-md text-text-secondary font-medium group-hover:text-white'>Liked Songs</span>
							</NavLink>
							<NavLink to="/library?tab=playlists" className='relative px-2 py-1.5 flex items-center gap-3 rounded-button group hover:bg-white/5 transition-colors'>
								<ListMusic size={16} className='text-text-secondary group-hover:text-white' strokeWidth={2} />
								<span className='text-body-md text-text-secondary font-medium group-hover:text-white'>Your Playlists</span>
							</NavLink>
							<NavLink to="/chat" className='relative px-2 py-1.5 flex items-center gap-3 rounded-button group hover:bg-white/5 transition-colors'>
								<MessageSquare size={16} className='text-text-secondary group-hover:text-white' strokeWidth={2} />
								<span className='text-body-md text-text-secondary font-medium group-hover:text-white'>Messaging</span>
							</NavLink>
						</SignedIn>
					</nav>
				</div>

				{/* Playlists / Albums section */}
				<div>
					<h2 className='text-overline text-text-tertiary px-2 mb-2'>Playlists</h2>
					<div className='flex flex-col gap-1'>
						{isLoading ? (
							Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className='flex items-center gap-3 px-2 py-1.5 animate-pulse'>
									<div className='w-10 h-10 bg-white/10 rounded-card' />
									<div className='flex-1 space-y-2'>
										<div className='h-3 bg-white/10 rounded w-3/4' />
										<div className='h-2 bg-white/10 rounded w-1/2' />
									</div>
								</div>
							))
						) : (
							albums.map((album) => (
								<NavLink
									to={`/albums/${album._id}`}
									key={album._id}
									className='flex items-center gap-3 px-2 py-1.5 rounded-button hover:bg-white/5 transition-colors group'
								>
									<img
										src={album.imageUrl}
										alt={album.title}
										className='w-10 h-10 rounded-card flex-shrink-0 object-cover'
										crossOrigin="anonymous"
									/>
									<div className='flex-1 min-w-0'>
										<p className='text-body-md text-text-secondary font-medium truncate group-hover:text-white transition-colors'>
											{album.title}
										</p>
										<p className='text-caption text-text-tertiary truncate'>
											Album
										</p>
									</div>
								</NavLink>
							))
						)}
					</div>
				</div>
			</div>
		</aside>
	);
};

export default LeftSidebar;
