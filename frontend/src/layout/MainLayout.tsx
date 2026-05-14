import LeftSidebar from "./components/LeftSidebar";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import MobileBottomNav from "./components/MobileBottomNav";
import AnimatedOutlet from "./components/AnimatedOutlet";

const MainLayout = () => {
	return (
		<div className='flex min-h-screen relative'>
			<AudioPlayer />
			<LeftSidebar />

			{/* Main Content Area */}
			<main className='flex-1 min-w-0 bg-background pb-32'>
				<AnimatedOutlet />
			</main>

			{/* Now Playing Bar (Sticky) */}
			<PlaybackControls />

			{/* Mobile NavBar */}
			<MobileBottomNav />
		</div>
	);
};

export default MainLayout;
