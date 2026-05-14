import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
	const { isLoaded, user } = useUser();
	const navigate = useNavigate();
	const syncAttempted = useRef(false);

	useEffect(() => {
		const syncUser = async () => {
			if (!isLoaded || !user || syncAttempted.current) return;

			try {
				syncAttempted.current = true;

				await axiosInstance.post("/auth/callback", {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					imageUrl: user.imageUrl,
				});
			} catch (error) {
				console.log("Error in auth callback", error);
			} finally {
				navigate("/");
			}
		};

		syncUser();
	}, [isLoaded, user, navigate]);

	return (
		<div className='min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden'>
			{/* Ambient glow */}
			<div className='absolute inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-surface-container-lowest' />
			</div>

			{/* Content */}
			<div className='relative z-10 flex flex-col items-center gap-xl'>
				{/* Spinner with branding */}
				<div className='relative'>
					<div className='w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center border border-outline-variant/30 shadow-2xl'>
						<span
							className='material-symbols-outlined text-primary text-[40px]'
							style={{ fontVariationSettings: "'FILL' 1" }}
						>
							graphic_eq
						</span>
					</div>
					{/* Animated ring */}
					<div className='absolute inset-[-8px] rounded-full border-2 border-primary/30 border-t-primary animate-spin' style={{ animationDuration: '1.2s' }} />
				</div>

				<div className='text-center space-y-sm'>
					<h2 className='font-title-md text-title-md text-on-surface'>
						Logging you in
					</h2>
					<p className='font-body-sm text-body-sm text-on-surface-variant'>
						Setting up your Melodix experience...
					</p>
				</div>

				{/* Progress dots */}
				<div className='flex gap-sm'>
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className='w-2 h-2 bg-primary rounded-full animate-bounce'
							style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1s' }}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
export default AuthCallbackPage;
