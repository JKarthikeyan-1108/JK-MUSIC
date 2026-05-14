import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<div className='min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-md'>
			{/* Ambient Background */}
			<div className='absolute inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-error/5 via-background to-primary/5' />
				{/* Floating decorative elements */}
				<div className='absolute top-[15%] left-[20%] opacity-10'>
					<span className='material-symbols-outlined text-error text-[120px]' style={{ fontVariationSettings: "'FILL' 1" }}>
						music_off
					</span>
				</div>
				<div className='absolute bottom-[20%] right-[15%] opacity-10'>
					<span className='material-symbols-outlined text-primary text-[80px]'>
						headphones
					</span>
				</div>
			</div>

			{/* Content */}
			<div className='relative z-10 text-center max-w-lg'>
				{/* Animated Icon */}
				<div className='flex justify-center mb-xl'>
					<div className='relative'>
						<div className='w-32 h-32 bg-surface-container-low rounded-full flex items-center justify-center border border-outline-variant/30 shadow-2xl'>
							<span
								className='material-symbols-outlined text-primary text-[64px] animate-bounce'
								style={{ fontVariationSettings: "'FILL' 1", animationDuration: '2s' }}
							>
								music_off
							</span>
						</div>
						{/* Pulse ring */}
						<div className='absolute inset-0 rounded-full border-2 border-primary/20 animate-ping' style={{ animationDuration: '3s' }} />
					</div>
				</div>

				{/* Error Code */}
				<h1 className='font-display-lg text-[96px] md:text-[128px] font-extrabold text-on-surface leading-none tracking-tighter'>
					4<span className='text-primary'>0</span>4
				</h1>

				{/* Error Message */}
				<h2 className='font-headline-lg text-headline-lg text-on-surface mt-md mb-sm'>
					Page not found
				</h2>
				<p className='font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto mb-xl'>
					Looks like this track got lost in the shuffle. The page you're looking for doesn't exist or has been moved.
				</p>

				{/* Action Buttons */}
				<div className='flex flex-col sm:flex-row gap-md justify-center items-center'>
					<button
						onClick={() => navigate(-1)}
						className='flex items-center justify-center gap-sm border-2 border-outline-variant text-on-surface px-xl py-md rounded-full font-bold hover:border-on-surface hover:bg-on-surface/5 transition-all w-full sm:w-auto'
					>
						<span className='material-symbols-outlined text-[20px]'>arrow_back</span>
						Go Back
					</button>
					<button
						onClick={() => navigate("/")}
						className='flex items-center justify-center gap-sm bg-primary text-background px-xl py-md rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto'
					>
						<span className='material-symbols-outlined text-[20px]' style={{ fontVariationSettings: "'FILL' 1" }}>
							home
						</span>
						Back to Home
					</button>
				</div>

				{/* Fun suggestion */}
				<div className='mt-xl bg-surface-container-low/80 backdrop-blur-md border border-outline-variant/20 rounded-xl p-lg inline-flex items-center gap-md'>
					<span className='material-symbols-outlined text-primary text-[24px]' style={{ fontVariationSettings: "'FILL' 1" }}>
						lightbulb
					</span>
					<p className='font-body-sm text-body-sm text-on-surface-variant text-left'>
						<span className='text-on-surface font-bold'>Tip:</span> Try searching for what you're looking for on the Home page.
					</p>
				</div>
			</div>
		</div>
	);
}
