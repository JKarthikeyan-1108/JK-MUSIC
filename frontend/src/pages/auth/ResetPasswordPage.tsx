import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Music, Eye, EyeOff, Loader2 } from "lucide-react";

const ResetPasswordPage = () => {
	const { signIn, isLoaded, setActive } = useSignIn();
	const navigate = useNavigate();

	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !code || !password) return;
		setIsLoading(true);
		setError("");

		try {
			const result = await signIn.attemptFirstFactor({
				strategy: "reset_password_email_code",
				code,
				password,
			});

			if (result.status === "complete") {
				await setActive({ session: result.createdSessionId });
				navigate("/auth-callback");
			} else {
				console.log(result);
				setError("Reset failed. Please try again.");
			}
		} catch (err: any) {
			setError(err.errors?.[0]?.longMessage || "Error resetting password.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4'>
			<div className='absolute inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-apple-red/10 via-black to-bg-secondary' />
			</div>

			<div className='relative z-10 w-full max-w-md'>
				<div className='apple-glass rounded-3xl p-8 shadow-2xl overflow-hidden'>
					<div className='text-center mb-8'>
						<div className='flex items-center justify-center gap-2 mb-4'>
							<Music className='text-apple-red' size={36} />
							<h1 className='text-display-sm font-bold text-apple-red tracking-tight'>JK Music</h1>
						</div>
						<h2 className='text-title-lg font-bold text-white mb-2'>Create new password</h2>
						<p className='text-body-sm text-text-secondary'>Enter the code sent to your email and your new password.</p>
					</div>

					<form onSubmit={handleResetPassword} className='flex flex-col gap-4'>
						{error && (
							<div className='bg-apple-red/20 border border-apple-red/30 rounded-lg p-3'>
								<p className='text-body-sm text-apple-red'>{error}</p>
							</div>
						)}

						<input
							type='text'
							value={code}
							onChange={(e) => setCode(e.target.value)}
							placeholder='Verification Code'
							className='w-full bg-white/5 border border-separator rounded-lg py-3 px-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-apple-red transition-all'
						/>

						<div className='relative'>
							<input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder='New Password'
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

						<button
							type='submit'
							disabled={isLoading || !isLoaded || !code || !password}
							className='w-full mt-2 bg-apple-red text-white py-3 px-6 rounded-pill font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2'
						>
							{isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
							{isLoading ? 'Resetting...' : 'Reset Password'}
						</button>
					</form>

					<div className='text-center mt-6'>
						<Link to='/login' className='text-body-sm text-text-secondary hover:text-white transition-colors'>
							Back to login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordPage;
