import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Music } from "lucide-react";

const SignUpPage = () => {
	const { signUp, isLoaded } = useSignUp();
	const navigate = useNavigate();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
	
	const [verifying, setVerifying] = useState(false);
	const [code, setCode] = useState("");
	
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const signInWithGoogle = () => {
		if (!isLoaded) return;
		signUp.authenticateWithRedirect({
			strategy: "oauth_google",
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/auth-callback",
		});
	};

	const signInWithApple = () => {
		if (!isLoaded) return;
		signUp.authenticateWithRedirect({
			strategy: "oauth_apple",
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/auth-callback",
		});
	};

	const getPasswordStrength = () => {
		let score = 0;
		if (password.length >= 8) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;
		return score;
	};

	const strength = getPasswordStrength();
	const strengthColors = ["bg-separator", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
	const strengthColor = strength === 0 ? strengthColors[0] : strengthColors[strength];

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !email || !password || !termsAccepted) return;
		
		setIsLoading(true);
		setError("");

		try {
			await signUp.create({
				firstName,
				lastName,
				emailAddress: email,
				password,
			});

			await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
			setVerifying(true);
		} catch (err: any) {
			setError(err.errors?.[0]?.longMessage || "Error creating account. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !code) return;
		
		setIsLoading(true);
		setError("");

		try {
			const result = await signUp.attemptEmailAddressVerification({
				code,
			});

			if (result.status === "complete") {
				window.location.href = "/auth-callback";
			}
		} catch (err: any) {
			setError(err.errors?.[0]?.longMessage || "Invalid verification code.");
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

			{/* Sign Up Card */}
			<div className='relative z-10 w-full max-w-md'>
				<div className='apple-glass rounded-3xl p-8 shadow-2xl'>
					{/* Branding */}
					<div className='text-center mb-8'>
						<div className='flex items-center justify-center gap-2 mb-4'>
							<Music className='text-apple-red' size={36} />
							<h1 className='text-display-sm font-bold text-apple-red tracking-tight'>JK Music</h1>
						</div>
						<h2 className='text-title-lg font-bold text-white mb-2'>Create an account</h2>
					</div>

					{verifying ? (
						<form onSubmit={handleVerify} className='flex flex-col gap-4'>
							<div className="text-center mb-4">
								<p className="text-body-md text-text-secondary">We sent a 6-digit code to</p>
								<p className="text-body-md font-semibold text-white">{email}</p>
							</div>
							
							{error && (
								<div className='bg-apple-red/20 border border-apple-red/30 rounded-lg p-3'>
									<p className='text-body-sm text-apple-red'>{error}</p>
								</div>
							)}

							<input
								type='text'
								value={code}
								onChange={(e) => setCode(e.target.value)}
								placeholder='123456'
								maxLength={6}
								className='w-full bg-white/5 border border-separator rounded-lg py-3 px-4 text-white text-center tracking-widest text-title-lg focus:outline-none focus:border-apple-red transition-all'
							/>

							<button
								type='submit'
								disabled={isLoading || code.length !== 6}
								className='w-full mt-4 bg-apple-red text-white py-3 px-6 rounded-pill font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50'
							>
								{isLoading ? "Verifying..." : "Verify Code"}
							</button>
						</form>
					) : (
						<>
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

							{/* Email/Password Form */}
							<form onSubmit={handleSignUp} className='flex flex-col gap-4 mb-6'>
								{error && (
									<div className='bg-apple-red/20 border border-apple-red/30 rounded-lg p-3'>
										<p className='text-body-sm text-apple-red'>{error}</p>
									</div>
								)}

								<div className='flex gap-3'>
									<input
										type='text'
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										placeholder='First name'
										className='w-1/2 bg-white/5 border border-separator rounded-lg py-3 px-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-apple-red transition-all'
									/>
									<input
										type='text'
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										placeholder='Last name'
										className='w-1/2 bg-white/5 border border-separator rounded-lg py-3 px-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-apple-red transition-all'
									/>
								</div>

								<input
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder='Email address'
									className='w-full bg-white/5 border border-separator rounded-lg py-3 px-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-apple-red transition-all'
								/>

								<div>
									<div className='relative'>
										<input
											type={showPassword ? 'text' : 'password'}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder='Password'
											className='w-full bg-white/5 border border-separator rounded-lg py-3 px-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-apple-red transition-all'
										/>
										<button
											type='button'
											onClick={() => setShowPassword(!showPassword)}
											className='absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors text-caption'
										>
											{showPassword ? 'Hide' : 'Show'}
										</button>
									</div>
									{/* Password Strength Indicator */}
									<div className="flex gap-1 mt-2">
										{[1, 2, 3, 4].map((level) => (
											<div 
												key={level} 
												className={`h-1 flex-1 rounded-full ${strength >= level ? strengthColor : 'bg-separator'}`} 
											/>
										))}
									</div>
								</div>

								<label className='flex items-start gap-3 mt-2 cursor-pointer'>
									<input
										type='checkbox'
										checked={termsAccepted}
										onChange={(e) => setTermsAccepted(e.target.checked)}
										className='mt-1 w-4 h-4 rounded bg-white/5 border-separator accent-apple-red'
									/>
									<span className='text-caption text-text-secondary'>
										I agree to the Terms of Service and Privacy Policy
									</span>
								</label>

								<button
									type='submit'
									disabled={isLoading || !isLoaded || !termsAccepted || strength < 2}
									className='w-full mt-2 bg-apple-red text-white py-3 px-6 rounded-pill font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center'
								>
									{isLoading ? "Creating account..." : "Sign Up"}
								</button>
							</form>

							{/* Login Link */}
							<div className='text-center'>
								<p className='text-body-sm text-text-secondary'>
									Already have an account?{' '}
									<Link to='/login' className='text-white font-bold hover:text-apple-red transition-colors'>
										Log in
									</Link>
								</p>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
