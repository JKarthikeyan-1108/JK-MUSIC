import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";

const LoginPage = () => {
	const { signIn, isLoaded } = useSignIn();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const signInWithGoogle = () => {
		if (!isLoaded) return;
		signIn.authenticateWithRedirect({
			strategy: "oauth_google",
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/auth-callback",
		});
	};

	const signInWithApple = () => {
		if (!isLoaded) return;
		signIn.authenticateWithRedirect({
			strategy: "oauth_apple",
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/auth-callback",
		});
	};

	const handleEmailSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !email || !password) return;
		setIsLoading(true);
		setError("");

		try {
			const result = await signIn.create({
				identifier: email,
				password,
			});

			if (result.status === "complete") {
				window.location.href = "/auth-callback";
			}
		} catch (err: any) {
			setError(err.errors?.[0]?.longMessage || "Invalid email or password. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-md'>
			{/* Ambient Background */}
			<div className='absolute inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-surface-container-lowest' />
				{/* Floating music notes */}
				<div className='absolute top-[20%] left-[15%] text-primary/20 animate-bounce' style={{ animationDuration: '3s' }}>
					<span className='material-symbols-outlined text-[64px]' style={{ fontVariationSettings: "'FILL' 1" }}>
						music_note
					</span>
				</div>
				<div className='absolute bottom-[25%] right-[10%] text-primary/15 animate-bounce' style={{ animationDuration: '4s', animationDelay: '1s' }}>
					<span className='material-symbols-outlined text-[48px]'>
						graphic_eq
					</span>
				</div>
				<div className='absolute top-[60%] left-[8%] text-primary/10 animate-bounce' style={{ animationDuration: '5s', animationDelay: '2s' }}>
					<span className='material-symbols-outlined text-[40px]'>
						music_note
					</span>
				</div>
			</div>

			{/* Login Card */}
			<div className='relative z-10 w-full max-w-md'>
				<div className='bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-xl shadow-2xl'>
					{/* Branding */}
					<div className='text-center mb-xl'>
						<div className='flex items-center justify-center gap-sm mb-md'>
							<span className='material-symbols-outlined text-primary text-[36px]' style={{ fontVariationSettings: "'FILL' 1" }}>
								music_note
							</span>
							<h1 className='font-headline-lg text-headline-lg text-primary tracking-tighter'>Melodix</h1>
						</div>
						<h2 className='font-title-md text-title-md text-on-surface mb-sm'>Log in to Melodix</h2>
						<span className='inline-block bg-primary/15 text-primary font-label-md text-label-md px-md py-xs rounded-full uppercase tracking-widest'>
							Premium
						</span>
					</div>

					{/* OAuth Buttons */}
					<div className='flex flex-col gap-md mb-lg'>
						<button
							onClick={signInWithGoogle}
							disabled={!isLoaded}
							className='w-full flex items-center justify-center gap-md bg-surface-container-high hover:bg-surface-variant border border-outline-variant/40 py-md px-lg rounded-full font-bold text-on-surface transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
						>
							<span className='material-symbols-outlined text-[20px]'>login</span>
							Continue with Google
						</button>

						<button
							onClick={signInWithApple}
							disabled={!isLoaded}
							className='w-full flex items-center justify-center gap-md bg-surface-container-high hover:bg-surface-variant border border-outline-variant/40 py-md px-lg rounded-full font-bold text-on-surface transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
						>
							<span className='material-symbols-outlined text-[20px]'>smartphone</span>
							Continue with Apple
						</button>

						<button
							disabled={!isLoaded}
							className='w-full flex items-center justify-center gap-md bg-surface-container-high hover:bg-surface-variant border border-outline-variant/40 py-md px-lg rounded-full font-bold text-on-surface transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
						>
							<span className='material-symbols-outlined text-[20px]'>group</span>
							Continue with Facebook
						</button>
					</div>

					{/* Divider */}
					<div className='flex items-center gap-md mb-lg'>
						<div className='flex-1 h-px bg-outline-variant/40' />
						<span className='font-label-md text-label-md text-on-surface-variant uppercase'>or</span>
						<div className='flex-1 h-px bg-outline-variant/40' />
					</div>

					{/* Email/Password Form */}
					<form onSubmit={handleEmailSignIn} className='flex flex-col gap-md mb-lg'>
						{error && (
							<div className='bg-error-container/20 border border-error/30 rounded-lg p-md'>
								<p className='font-body-sm text-body-sm text-error'>{error}</p>
							</div>
						)}

						<div className='relative'>
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='Email address or username'
								className='w-full bg-surface-container-high border border-outline-variant/40 rounded-lg py-md px-lg text-on-surface placeholder:text-on-surface-variant/60 font-body-lg text-body-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all'
							/>
						</div>

						<div className='relative'>
							<input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder='Password'
								className='w-full bg-surface-container-high border border-outline-variant/40 rounded-lg py-md px-lg pr-12 text-on-surface placeholder:text-on-surface-variant/60 font-body-lg text-body-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all'
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors'
							>
								<span className='material-symbols-outlined text-[20px]'>
									{showPassword ? 'visibility_off' : 'visibility'}
								</span>
							</button>
						</div>

						{/* Remember Me & Forgot */}
						<div className='flex items-center justify-between'>
							<label className='flex items-center gap-sm cursor-pointer'>
								<input
									type='checkbox'
									className='w-4 h-4 rounded bg-surface-container-high border-outline-variant accent-primary'
								/>
								<span className='font-body-sm text-body-sm text-on-surface-variant'>Remember me</span>
							</label>
							<a href='#' className='font-body-sm text-body-sm text-on-surface-variant hover:text-primary underline transition-colors'>
								Forgot your password?
							</a>
						</div>

						{/* Login Button */}
						<button
							type='submit'
							disabled={isLoading || !isLoaded}
							className='w-full bg-primary text-background py-md px-lg rounded-full font-bold text-body-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-sm shadow-lg shadow-primary/20'
						>
							{isLoading ? (
								<>
									<span className='material-symbols-outlined animate-spin text-[20px]'>progress_activity</span>
									Logging in...
								</>
							) : (
								'Log In'
							)}
						</button>
					</form>

					{/* Sign Up Link */}
					<div className='text-center'>
						<p className='font-body-sm text-body-sm text-on-surface-variant'>
							Don't have an account?{' '}
							<a href='#' className='text-on-surface font-bold hover:text-primary underline transition-colors'>
								Sign up for Melodix
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
