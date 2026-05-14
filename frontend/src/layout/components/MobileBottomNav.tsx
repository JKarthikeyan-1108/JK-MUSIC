import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
	const location = useLocation();
	const isActive = (path: string) => location.pathname === path;

	return (
		<nav className='md:hidden fixed bottom-0 left-0 right-0 bg-surface-container/95 backdrop-blur-lg flex justify-around items-center py-sm z-50 border-t border-outline-variant'>
			<Link
				to='/'
				className={`flex flex-col items-center gap-xs ${
					isActive('/') ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'
				}`}
			>
				<span className='material-symbols-outlined' style={isActive('/') ? { fontVariationSettings: "'FILL' 1" } : undefined}>
					home
				</span>
				<span className='text-[10px] font-label-md'>Home</span>
			</Link>
			<Link
				to='/search'
				className={`flex flex-col items-center gap-xs ${
					isActive('/search') ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'
				}`}
			>
				<span className='material-symbols-outlined' style={isActive('/search') ? { fontVariationSettings: "'FILL' 1" } : undefined}>search</span>
				<span className='text-[10px] font-label-md'>Explore</span>
			</Link>
			<Link
				to='/library'
				className={`flex flex-col items-center gap-xs ${
					isActive('/library') ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'
				}`}
			>
				<span className='material-symbols-outlined' style={isActive('/library') ? { fontVariationSettings: "'FILL' 1" } : undefined}>library_music</span>
				<span className='text-[10px] font-label-md'>Library</span>
			</Link>
		</nav>
	);
};

export default MobileBottomNav;
