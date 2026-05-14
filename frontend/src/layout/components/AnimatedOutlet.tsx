import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const pageVariants = {
	initial: {
		opacity: 0,
		y: 8,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: [0.25, 0.1, 0.25, 1],
		},
	},
	exit: {
		opacity: 0,
		y: -8,
		transition: {
			duration: 0.2,
			ease: [0.25, 0.1, 0.25, 1],
		},
	},
};

const AnimatedOutlet = () => {
	const location = useLocation();
	const outlet = useOutlet();

	return (
		<AnimatePresence mode='wait'>
			<motion.div
				key={location.pathname}
				variants={pageVariants}
				initial='initial'
				animate='animate'
				exit='exit'
				className='h-full'
			>
				{outlet}
			</motion.div>
		</AnimatePresence>
	);
};

export default AnimatedOutlet;
