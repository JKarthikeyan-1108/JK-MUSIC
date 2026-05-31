import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Music, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LoginPage = () => {
	const { signIn, isLoaded } = useSignIn();
	const navigate = useNavigate();
	
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	
	// Forgot password state
	const [isForgotPassword, setIsForgotPassword] = useState(false);
	const [resetSent, setResetSent] = useState(false);

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

	const handleSendResetLink = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !email) {
			setError("Please enter your email address.");
			return;
		}
		
		setIsLoading(true);
		setError("");

		try {
			await signIn.create({
				strategy: "reset_password_email_code",
				identifier: email,
			});
			setResetSent(true);
		} catch (err: any) {
			setError(err.errors?.[0]?.longMessage || "Error sending reset link.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4'>
			{/* Ambient Background */}
			<div className='absolute inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-apple-red/10 via-black to-bg-secondary' />
			</div>

			{/* Login Card */}
			<div className='relative z-10 w-full max-w-md'>
				<div className='apple-glass rounded-3xl p-8 shadow-2xl overflow-hidden'>
					{/* Branding */}
					<div className='text-center mb-8'>
						<div className='flex items-center justify-center gap-2 mb-4'>
							<Music className='text-apple-red' size={36} />
							<h1 className='text-display-sm font-bold text-apple-red tracking-tight'>JK Music</h1>
						</div>
						<h2 className='text-title-lg font-bold text-white mb-2'>Log in to JK Music</h2>
					</div>

					{/* OAuth Buttons */}
					<div className='flex flex-col gap-3 mb-6'>
						<button
							onClick={signInWithGoogle}
							disabled={!isLoaded}
							className='w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-separator py-3 px-6 rounded-pill font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
						>
							Continue with Google
						</button>

						<button
							onClick={signInWithApple}
							disabled={!isLoaded}
							className='w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-separator py-3 px-6 rounded-pill font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
						>
							Continue with Apple
						</button>
					</div>

					{/* Divider */}
					<div className='flex items-center gap-4 mb-6'>
						<div className='flex-1 h-px bg-separator' />
						<span className='text-caption text-text-secondary uppercase'>or</span>
						<div className='flex-1 h-px bg-separator' />
					</div>

					{/* Forms Container */}
					<div className="relative">
						<AnimatePresence mode="wait">
							{!isForgotPassword ? (
								<motion.form 
									key="login-form"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									transition={{ duration: 0.2 }}
									onSubmit={handleEmailSignIn} 
									className='flex flex-col gap-4 mb-6'
								>
									{error && (
										<div className='bg-apple-red/20 border border-apple-red/30 rounded-lg p-3'>
											<p className='text-body-sm text-apple-red'>{error}</p>
										</div>
									)}

									<input
										type='email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder='Email address'
										className='w-full bg-white/5 border border-separator rounded-lg py-3 px-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-apple-red transition-all'
									/>

									<div className='relative'>
										<input
											type={showPassword ? 'text' : 'password'}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder='Password'
											className='w-full bg-white/5 border border-separator rounded-lg py-3 px-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-apple-red transition-all pr-12'
										/>
										<button
											type='button'
											onClick={() => setShowPassword(!showPassword)}
											className='absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors'
										>
											{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
										</button>
									</div>

									<div className='flex justify-end'>
										<button 
											type="button" 
											onClick={() => { setIsForgotPassword(true); setError(""); }}
											className='text-caption text-text-secondary hover:text-white transition-colors'
										>
											Forgot your password?
										</button>
									</div>

									<button
										type='submit'
										disabled={isLoading || !isLoaded}
										className='w-full mt-2 bg-apple-red text-white py-3 px-6 rounded-pill font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2'
									>
										{isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
										{isLoading ? 'Logging in...' : 'Log In'}
									</button>
								</motion.form>
							) : (
								<motion.div
									key="forgot-password"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									transition={{ duration: 0.2 }}
									className='flex flex-col gap-4 mb-6'
								>
									{error && (
										<div className='bg-apple-red/20 border border-apple-red/30 rounded-lg p-3'>
											<p className='text-body-sm text-apple-red'>{error}</p>
										</div>
									)}

									{resetSent ? (
										<div className="text-center py-4">
											<div className="w-16 h-16 bg-apple-red/20 text-apple-red rounded-full flex items-center justify-center mx-auto mb-4">
												<Music size={24} />
											</div>
											<h3 className="text-title-sm text-white mb-2">Check your email</h3>
											<p className="text-body-sm text-text-secondary mb-6">
												We've sent a password reset code to {email}
											</p>
											<button 
												onClick={() => navigate('/reset-password')}
												className='w-full bg-white/10 text-white py-3 px-6 rounded-pill font-bold hover:bg-white/20 transition-all'
											>
												Enter Code
											</button>
										</div>
									) : (
										<form onSubmit={handleSendResetLink} className="flex flex-col gap-4">
											<p className="text-body-sm text-text-secondary mb-2">
												Enter your email address and we'll send you a code to reset your password.
											</p>
											<input
												type='email'
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder='Email address'
												className='w-full bg-white/5 border border-separator rounded-lg py-3 px-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-apple-red transition-all'
											/>
											<button
												type='submit'
												disabled={isLoading || !isLoaded || !email}
												className='w-full mt-2 bg-apple-red text-white py-3 px-6 rounded-pill font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2'
											>
												{isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
												{isLoading ? 'Sending...' : 'Send reset code'}
											</button>
											<button
												type="button"
												onClick={() => setIsForgotPassword(false)}
												className="mt-2 text-body-sm text-text-secondary hover:text-white transition-colors"
											>
												Back to login
											</button>
										</form>
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Sign Up Link */}
					<div className='text-center mt-2'>
						<p className='text-body-sm text-text-secondary'>
							Don't have an account?{' '}
							<Link to='/signup' className='text-white font-bold hover:text-apple-red transition-colors'>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
