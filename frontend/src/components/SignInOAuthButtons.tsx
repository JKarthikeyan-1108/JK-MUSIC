import { useSignIn } from "@clerk/clerk-react";

const SignInOAuthButtons = () => {
	const { signIn, isLoaded } = useSignIn();

	if (!isLoaded) {
		return null;
	}

	const signInWithGoogle = () => {
		signIn.authenticateWithRedirect({
			strategy: "oauth_google",
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/auth-callback",
		});
	};

	return (
		<button
			onClick={signInWithGoogle}
			className='flex items-center gap-sm bg-on-surface text-background px-md py-xs rounded-full font-bold text-label-md hover:scale-105 transition-transform'
		>
			<img src='/google.png' alt='Google' className='size-4' />
			Continue with Google
		</button>
	);
};
export default SignInOAuthButtons;
