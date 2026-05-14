import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
	const location = useLocation();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	const isActive = (path: string) => location.pathname === path;

	return (
		<aside className='hidden md:flex flex-col gap-lg p-lg border-r border-outline-variant bg-surface-container-lowest h-screen w-[280px] left-0 sticky shrink-0'>
			{/* Branding */}
			<div className='flex items-center gap-md'>
				<div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
					<span className='material-symbols-outlined text-on-primary' style={{ fontVariationSettings: "'FILL' 1" }}>
						graphic_eq
					</span>
				</div>
				<div>
					<h1 className='font-headline-lg text-headline-lg text-primary tracking-tighter'>JK Music</h1>
					<p className='font-label-md text-label-md text-on-surface-variant'>Premium</p>
				</div>
			</div>

			{/* Navigation */}
			<nav className='flex flex-col gap-sm mt-xl'>
				<Link
					to='/'
					className={`flex items-center gap-md p-md rounded-lg hover:translate-x-1 duration-200 transition-all ${
						isActive('/') ? 'text-on-surface font-bold' : 'text-on-surface-variant font-medium hover:text-on-surface'
					}`}
				>
					<span className='material-symbols-outlined' style={isActive('/') ? { fontVariationSettings: "'FILL' 1" } : undefined}>
						home
					</span>
					<span className='font-body-lg text-body-lg'>Home</span>
				</Link>

				<Link
					to='/search'
					className={`flex items-center gap-md p-md rounded-lg hover:translate-x-1 duration-200 transition-all ${
						isActive('/search') ? 'text-on-surface font-bold' : 'text-on-surface-variant font-medium hover:text-on-surface'
					}`}
				>
					<span className='material-symbols-outlined' style={isActive('/search') ? { fontVariationSettings: "'FILL' 1" } : undefined}>
						search
					</span>
					<span className='font-body-lg text-body-lg'>Search</span>
				</Link>

				<SignedIn>
					<Link
						to='/chat'
						className={`flex items-center gap-md p-md rounded-lg hover:translate-x-1 duration-200 transition-all ${
							isActive('/chat') ? 'text-on-surface font-bold' : 'text-on-surface-variant font-medium hover:text-on-surface'
						}`}
					>
						<span className='material-symbols-outlined'>chat</span>
						<span className='font-body-lg text-body-lg'>Messages</span>
					</Link>
				</SignedIn>

				<Link
					to='/library'
					className={`flex items-center gap-md p-md rounded-lg hover:translate-x-1 duration-200 transition-all ${
						isActive('/library') ? 'text-on-surface font-bold' : 'text-on-surface-variant font-medium hover:text-on-surface'
					}`}
				>
					<span className='material-symbols-outlined' style={isActive('/library') ? { fontVariationSettings: "'FILL' 1" } : undefined}>
						library_music
					</span>
					<span className='font-body-lg text-body-lg'>Your Library</span>
				</Link>
			</nav>

			{/* Create Playlist */}
			<button className='mt-lg w-full bg-surface-container-high py-md px-lg rounded-full font-bold text-on-surface hover:scale-105 transition-transform flex items-center justify-center gap-sm'>
				<span className='material-symbols-outlined text-[20px]'>add</span>
				<span>Create Playlist</span>
			</button>

			{/* Library / Albums */}
			{albums.length > 0 && (
				<div className='flex-1 overflow-y-auto custom-scrollbar mt-md space-y-1'>
					{isLoading ? (
						<div className='space-y-3 px-md'>
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className='flex items-center gap-3 animate-pulse'>
									<div className='w-12 h-12 bg-surface-container-high rounded-md' />
									<div className='flex-1 space-y-2'>
										<div className='h-3 bg-surface-container-high rounded w-3/4' />
										<div className='h-2 bg-surface-container-high rounded w-1/2' />
									</div>
								</div>
							))}
						</div>
					) : (
						albums.map((album) => (
							<Link
								to={`/albums/${album._id}`}
								key={album._id}
								className='flex items-center gap-md p-sm rounded-lg hover:bg-surface-container-high transition-all hover:translate-x-1 duration-200 group'
							>
								<img
									src={album.imageUrl}
									alt={album.title}
									className='w-12 h-12 rounded-md flex-shrink-0 object-cover shadow-lg'
								/>
								<div className='flex-1 min-w-0'>
									<p className='font-body-lg text-body-lg text-on-surface truncate'>
										{album.title}
									</p>
									<p className='font-body-sm text-body-sm text-on-surface-variant truncate'>
										Album • {album.artist}
									</p>
								</div>
							</Link>
						))
					)}
				</div>
			)}

			{/* Bottom Links */}
			<div className='mt-auto flex flex-col gap-sm pt-lg border-t border-outline-variant'>
				<a href='#' className='flex items-center gap-md p-md text-on-surface-variant font-medium hover:text-on-surface transition-all'>
					<span className='material-symbols-outlined text-primary' style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
					<span className='font-body-sm text-body-sm'>Liked Songs</span>
				</a>
				<a href='#' className='flex items-center gap-md p-md text-on-surface-variant font-medium hover:text-on-surface transition-all'>
					<span className='material-symbols-outlined'>auto_awesome</span>
					<span className='font-body-sm text-body-sm'>Discover Weekly</span>
				</a>
				<a href='#' className='flex items-center gap-md p-md text-on-surface-variant font-medium hover:text-on-surface transition-all'>
					<span className='material-symbols-outlined'>radio</span>
					<span className='font-body-sm text-body-sm'>Daily Mix 1</span>
				</a>
			</div>
		</aside>
	);
};

export default LeftSidebar;
