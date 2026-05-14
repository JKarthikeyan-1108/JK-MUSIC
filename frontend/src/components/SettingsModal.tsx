import { useState, useEffect } from "react";
import { SignOutButton, useUser } from "@clerk/clerk-react";

interface SettingsModalProps {
	onClose: () => void;
}

const SettingsModal = ({ onClose }: SettingsModalProps) => {
	const { user } = useUser();
	const [volume, setVolume] = useState(() => {
		const saved = localStorage.getItem("playerVolume");
		return saved ? parseInt(saved, 10) : 75;
	});
	const [theme, setTheme] = useState("Dark");

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	return (
		<div className='fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'>
			<div className='bg-surface-container-high w-full max-w-md rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden'>
				{/* Header */}
				<div className='flex items-center justify-between p-lg border-b border-outline-variant/30'>
					<h2 className='font-title-lg text-title-lg font-bold text-on-surface'>Settings</h2>
					<button
						onClick={onClose}
						className='w-10 h-10 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors'
					>
						<span className='material-symbols-outlined'>close</span>
					</button>
				</div>

				{/* Content */}
				<div className='p-lg space-y-xl'>
					{/* Profile */}
					{user && (
						<div className='flex items-center gap-md'>
							<img src={user.imageUrl} alt='Profile' className='w-16 h-16 rounded-full' />
							<div>
								<h3 className='font-title-md text-title-md font-bold text-on-surface'>
									{user.fullName || "User"}
								</h3>
								<p className='font-body-sm text-body-sm text-on-surface-variant'>
									{user.primaryEmailAddress?.emailAddress}
								</p>
								<span className='inline-block mt-xs bg-primary/20 text-primary px-sm py-xs rounded-full font-label-sm text-label-sm uppercase tracking-wider'>
									Premium
								</span>
							</div>
						</div>
					)}

					{/* Playback Settings */}
					<div>
						<h3 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md'>
							Playback
						</h3>
						<div className='space-y-md'>
							<div className='flex items-center justify-between'>
								<span className='font-body-md text-body-md text-on-surface'>Default Volume</span>
								<span className='font-body-md text-body-md text-primary font-bold'>{volume}%</span>
							</div>
							<input
								type='range'
								min='0'
								max='100'
								value={volume}
								onChange={(e) => {
									const val = parseInt(e.target.value, 10);
									setVolume(val);
									localStorage.setItem("playerVolume", val.toString());
								}}
								className='w-full accent-primary bg-surface-container-highest rounded-full appearance-none h-2'
							/>
							<div className='flex items-center justify-between mt-sm'>
								<span className='font-body-md text-body-md text-on-surface'>Audio Quality</span>
								<select className='bg-surface-container-low border border-outline-variant/30 rounded-lg px-md py-xs text-on-surface outline-none focus:border-primary'>
									<option>Automatic</option>
									<option>High</option>
									<option>Very High</option>
								</select>
							</div>
						</div>
					</div>

					{/* App Settings */}
					<div>
						<h3 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md'>
							Appearance
						</h3>
						<div className='flex items-center justify-between'>
							<span className='font-body-md text-body-md text-on-surface'>Theme</span>
							<select
								value={theme}
								onChange={(e) => setTheme(e.target.value)}
								className='bg-surface-container-low border border-outline-variant/30 rounded-lg px-md py-xs text-on-surface outline-none focus:border-primary'
							>
								<option>Dark</option>
								<option>Light (Coming Soon)</option>
								<option>System</option>
							</select>
						</div>
					</div>

					{/* Danger Zone */}
					<div className='pt-md border-t border-outline-variant/30'>
						<SignOutButton>
							<button className='w-full py-md rounded-lg bg-error-container/20 text-error hover:bg-error-container/40 transition-colors font-bold text-label-lg flex items-center justify-center gap-sm'>
								<span className='material-symbols-outlined'>logout</span>
								Log Out
							</button>
						</SignOutButton>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsModal;
