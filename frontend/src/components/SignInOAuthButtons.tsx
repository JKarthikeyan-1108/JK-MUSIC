import { Link } from "react-router-dom";

const SignInOAuthButtons = () => {
	return (
		<div className="flex items-center gap-3">
			<Link
				to="/signup"
				className='hidden sm:flex text-text-secondary hover:text-white font-bold text-label-md transition-colors'
			>
				Sign up
			</Link>
			<Link
				to="/login"
				className='flex items-center bg-white text-black px-md py-xs rounded-full font-bold text-label-md hover:scale-105 transition-transform'
			>
				Log in
			</Link>
		</div>
	);
};
export default SignInOAuthButtons;
