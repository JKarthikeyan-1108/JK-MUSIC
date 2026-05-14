import { SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";

const Topbar = () => {
	const { isAdmin } = useAuthStore();

	return (
		<header className='bg-background/80 backdrop-blur-md font-title-md text-title-md flex justify-between items-center px-lg py-md w-full z-40 sticky top-0'>
			<div className='flex items-center gap-lg'>
				{/* Mobile menu */}
				<div className='flex gap-sm md:hidden'>
					<span className='material-symbols-outlined p-xs'>menu</span>
				</div>
				{/* Desktop nav buttons */}
				<div className='hidden md:flex gap-sm'>
					<button
						onClick={() => window.history.back()}
						className='w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface'
					>
						<span className='material-symbols-outlined'>chevron_left</span>
					</button>
					<button
						onClick={() => window.history.forward()}
						className='w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface opacity-50'
					>
						<span className='material-symbols-outlined'>chevron_right</span>
					</button>
				</div>
			</div>

			<div className='flex items-center gap-md'>
				{isAdmin && (
					<Link
						to='/admin'
						className='hidden sm:flex bg-on-surface text-background px-md py-xs rounded-full font-bold text-label-md hover:scale-105 transition-transform items-center gap-sm'
					>
						<span className='material-symbols-outlined text-[16px]'>dashboard</span>
						Admin
					</Link>
				)}

				<div className='flex items-center gap-sm'>
					<span className='material-symbols-outlined p-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer'>
						notifications
					</span>
					<span className='material-symbols-outlined p-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer'>
						settings
					</span>
				</div>

				<SignedOut>
					<SignInOAuthButtons />
				</SignedOut>

				<div className='w-8 h-8 rounded-full overflow-hidden ml-sm border-2 border-outline-variant'>
					<UserButton />
				</div>
			</div>
		</header>
	);
};

export default Topbar;
