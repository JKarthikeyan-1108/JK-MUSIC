import Topbar from "@/components/Topbar";
import SettingsModal from "@/components/SettingsModal";
import { useState } from "react";
import { Search } from "lucide-react"; // Using this temporarily for the input icon

const CATEGORIES = [
	{
		id: "pop",
		title: "Pop",
		color: "from-primary-container/80 to-primary/40",
		textColor: "text-on-primary-container",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOZWwr27qpgEFHr7i0FSmzVZEpyMStOgKi-g_9gx1Yu2XQ9LeX3FPZYTt0pGljASAYxeK7eJndMQbRnExBgvDxU9pBlfAZ3f0U3rcKm1rcxnYtUNzMqvlsNS3f5cb2leiMfo_4Us-JwAqpD8VGpqTZhXx4EEUYEjvvMyOfXwSBWFFRbvQftLSuqhuVfRHnTW5lkgAfQNGx1Q0M19mhGHsK8W1AVHvzJSnwHTP7_2-74sm6veRPjkVXo5ZHlie3H0rZr9gZqHKk-oA",
		colSpan: "col-span-2",
		isTrending: true,
	},
	{
		id: "hiphop",
		title: "Hip-Hop",
		color: "from-on-error-container/80 to-error/30",
		textColor: "text-on-error-container",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXxGfsPpilh2za3bVxZRYDHHJ9rwqTXMsjbR4DP5dF-KOuG3qRqnS563iFR02tY8JUpbFbV9vCmz9SMd26Xamf0eVABeqdj08OYoh1hiCL3Clt7UAaEfXfXqBkyQ8z278G88eSULN3P4W4MQGqn8yKjSXf-XlaKTR67GDMdM3FUyT5apWd-zOM0Y5_4jHhsXzewkNJNylj7ZxeBbdNWfK3l21Gr3nScUwBO0vM9OmfbwZC_kquCGRjpyEyZ07LOeVqO5gXbsFyIns",
		colSpan: "col-span-1",
	},
	{
		id: "rock",
		title: "Rock",
		color: "from-on-tertiary-container/80 to-secondary/30",
		textColor: "text-on-tertiary-container",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjo7xcULSx8865QM36rQDeMUqL5P0IfNclKsfckeEJM7WZxmHZzZriytEZpJAlu-2dT7ZcMFh7_sOi3OBJ55x3pWTzTXUJcWAZOTySMsAg3b0v0k7BaryAc_GF-el0Qchmac2-BM68EzaoDGIlkLOyQbaxerGED1NumrQUOMGUbKsM_4xUxDWhpTFw3YOGXGtHBe_RCcmJZU918qCrY8g0dt3ym9TZoOZROwoBismuBAVM5dLAaLqXM__FEnbW9SXSVmuSM0kO_BE",
		colSpan: "col-span-1",
	},
	{
		id: "electronic",
		title: "Electronic",
		color: "from-primary/60 to-surface-container-highest",
		textColor: "text-on-primary",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRDQAq04LuGz9SHtR-Umkug965PdjumjWZBM4D0d8xZhifua3eHmLLhzl2_TC1OKjzNdnAIrO5UonNoguc0g_-wNJBsJ5QrjeKY0yIYunrAUXrvtfzJ9uzIHNo0q4ZqJv7FxDRIO-RCuG0a70J5LvKiqhbi7RGrJccK4H7aNV26PMZuHcfbFvE-affUkfGzK7_Y0Yxfw6mnNu2GTI0pHECpmkQJRsH0n3CLyYJQWKKzd5GJSta8wJlxRuAv6JBZGSmLwJwfw6THlg",
		colSpan: "col-span-1",
	},
	{
		id: "jazz",
		title: "Jazz",
		color: "from-tertiary-fixed-dim/70 to-on-surface-variant/20",
		textColor: "text-on-tertiary",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD52YJ0Fl7kJbErWFvQfrEvEqG9MyhNuQTOvshdhMD2eFNXx6K7aFxZIajoDGLo1NpLe4kSgtavDNyBfGCDQHmGDOrxGtioLI6fEO8oA0HTKwdmDK2PJhFJyVxAZTtluImmoh7u_3-HkPElcGc7rsFsi1xXhl4yOOi5-SRGElCGwO4Cc24WowB_lZpc8qLTABlmoenXIXLc77CwYu0kJHdWjEyc5nFyytXIn92qsIG5zuPIlktLNVxT2Kczl_UYBAY0o9cUKycOxQo",
		colSpan: "col-span-1",
	},
	{
		id: "latin",
		title: "Latin",
		color: "from-error/60 to-primary/20",
		textColor: "text-white",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ3IbmIuEvCOBzS86EwoRX-0whuHdEgeSH92B9xFSFj7g599c59KdgrnUzK0hX2QdpMxeAJXrCJWY_LBMgIApPdPhbHTOfCpIBNvupk2rRQh1oLqKMTRoAq8ZQj1UkUP7C-hUTTYyB84V-181_BIB-gPxUcUskTrd21Let7CMEEuIhYCHXKe6_ZsT7cJ55uDhlCpbC14cIrTo4DrzQFNMHZcPnGz9A81nOJM6_N10PC_YtGHdC4BsOpcJCFb2AvfUfqMZqtnmm8QU",
		colSpan: "col-span-1 md:col-span-2",
		isLargeText: true,
	},
	{
		id: "chill",
		title: "Chill",
		color: "from-surface-variant/80 to-outline-variant/30",
		textColor: "text-on-surface",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKtBARqtXHKZ1kpMK1ooxVNQEQzTaEil8bgGMR9gjKshl5DY0mYFjHEZdACfLjul-1bmJ4CEL2tKb1Jy1ZsE8kboKQOUHr-XU371tsvVfNAbtwHBAqkaX6B-BNrgEM_xKutGz7LrxlTw-hsRodgG5keSxzEtCLK4rYByplrJ5AM7xaQemZnIq57MK4_dW-SwnNH6lRl9JUBOgz-sKQbYXR_5jnPETlwT-VD_GsWtTKaQj-46F40DrI0yfsGiFlIESOvg2u8EUH8vo",
		colSpan: "col-span-1",
	},
	{
		id: "focus",
		title: "Focus",
		color: "from-secondary-container/80 to-surface-bright/20",
		textColor: "text-on-secondary-container",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUL2xQmGSFYNVi0sfAdjU8QoTW8nqvjNJA2CIkADWo1NnHxXbKetZEElb-eHcrH8xNgSpO2ba5J_DEXB8mrN8mGYMdpJs4XIceJI3f9fHc9Ud8VVDvNN3qIZGGHmiilC98fuRlRq-kQtlU9b1X4SFrCsy83IiUz_KA1Cyia_fnCdXtewMzWZznC_sOLsCUIduLyRDJYjPStZtoL3ekKg1OMgvdRSf7G2VsIlWCGEbCEw3TJEkimQPwqpoDigiYpVuZNwkVSVJmYhs",
		colSpan: "col-span-1",
	},
];

const MOODS = [
	{
		id: "morning",
		title: "Morning Coffee Acoustic",
		subtitle: "Start your day with a gentle selection of curated acoustic tracks.",
		label: "FOR YOU",
		labelColor: "text-primary",
		glowColor: "bg-primary/10 group-hover:bg-primary/20",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDC4HQuMtl1Ql178fRctCshGffCf9QV-ywP_nPOuMMspl-8_bo_eS1qstUevEdn-I6jyHbDLD4rs6a5QfQ9_uusJI_xOPVSZLy6c_gRFzAzsSS2TKhAZffC1s9L79lfD_bMwjtQWai-7oa69CWT1tioy_aLDbsNMOlz5QxiJuzR-MwsbkacOw83GEAzxVtJMaFZCj7FL_rDfw1E9jnvNNfM1mWPD8IWP7gxa8_PaLwBZ2Jspd9Mn_KhQV84w7B39yEf4oVjQstpJSo",
	},
	{
		id: "night",
		title: "Synthwave Cityscapes",
		subtitle: "The ultimate companion for your late-night urban drives.",
		label: "CURATED",
		labelColor: "text-secondary",
		glowColor: "bg-secondary/10 group-hover:bg-secondary/20",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeMKuvIvPyCGXzwdkzAobHZevFgD_z98sV3JY_RZNIy7LQyFbaQHA1gMQVZTIIimWJEU0612y_wxBSP0SikCaiqNi793-g4iwYJ2S5hEdf3O-mXKON5gmYfHRP-iY378Axkb_3XdiTeOoLImIZidzMbAgKkJMBoiV-NHVU0DWi3W5_y_pMxm-pe6vMLTNZtyt1XZVY67hzY1NJA1cK7rCh28D68-UMwvS7BuokPAXCr-GIOx6AkxKIg0Rpa9Rl8aLFSHKh8MLkh80",
	},
];

const SearchPage = () => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	return (
		<>
			{/* Custom TopBar for Search */}
			<header className='bg-background/80 backdrop-blur-md sticky top-0 z-40 w-full flex justify-between items-center px-lg py-md transition-all'>
				<div className='flex items-center gap-lg flex-grow max-w-2xl'>
					<div className='flex md:hidden font-display-lg text-headline-lg font-extrabold text-primary mr-sm'>M</div>
					<div className='relative w-full group'>
						<span className='material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors'>
							search
						</span>
						<input
							type='text'
							placeholder='What do you want to listen to?'
							className='w-full bg-surface-container-high border-none rounded-full py-md pl-xl pr-md text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all font-body-lg text-body-lg'
						/>
					</div>
				</div>
				<div className='flex items-center gap-md ml-lg'>
					<button className='p-sm rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors active:scale-95'>
						<span className='material-symbols-outlined'>notifications</span>
					</button>
					<button onClick={() => setIsSettingsOpen(true)} className='p-sm rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors active:scale-95'>
						<span className='material-symbols-outlined'>settings</span>
					</button>
					<div className='w-10 h-10 rounded-full overflow-hidden border border-outline-variant ml-sm hover:ring-2 hover:ring-primary transition-all cursor-pointer hidden sm:block'>
						<img
							src='https://lh3.googleusercontent.com/aida-public/AB6AXuAPMjRBd7Cg5x30boNfAAxfxQx7ODA0ho3FxnzIrWpl8L4wvsU1ABlUtJDhfxcmP9MIiDfBcx3LM-rkCe4d4M70gw89_utkcl71ix_Kp-gI0tuGY-lCsnOF414vZfirs97i2zFVhCesRUEwOq4h_skDPimLY6mdWWwXh953KktNid-mmHbw3NWkWK94oz30BaVZOkbX1OHAAyXvu7yEaMxGQ5JeYb9gFyoscvlBUBlojOv-Th_TrR95Xfoh3PMgs7R0cbNAKZNaNBk'
							alt='User profile'
							className='w-full h-full object-cover'
						/>
					</div>
				</div>
			</header>

			{/* Search Content */}
			<div className='px-lg pb-xl pt-md max-w-7xl mx-auto'>
				<section className='mb-xl'>
					<h2 className='font-headline-lg text-headline-lg text-on-surface mb-lg'>Browse All</h2>

					{/* Genre Grid (Asymmetric Bento Style) */}
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-gutter'>
						{CATEGORIES.map((category) => (
							<div
								key={category.id}
								className={`${category.colSpan} relative h-56 rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300`}
							>
								<div className={`absolute inset-0 bg-gradient-to-br ${category.color} z-10 group-hover:opacity-90 transition-opacity`} />
								<img
									src={category.image}
									alt={category.title}
									className='absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
								/>
								<div className={`relative z-20 p-lg flex flex-col ${category.isTrending ? 'justify-between' : 'justify-end'} h-full`}>
									{category.isTrending ? (
										<>
											<span className={`font-display-lg text-headline-lg ${category.textColor} font-extrabold rotate-[-5deg] origin-left`}>
												{category.title}
											</span>
											<div className='opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300'>
												<span className='bg-black/20 backdrop-blur-md px-md py-xs rounded-full text-white font-label-md text-label-md'>
													Trending Now
												</span>
											</div>
										</>
									) : (
										<span className={`${category.isLargeText ? 'font-display-lg text-headline-lg font-extrabold' : 'font-title-md text-title-md'} ${category.textColor}`}>
											{category.title}
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				</section>

				<section className='mb-xl'>
					<h2 className='font-headline-lg text-headline-lg text-on-surface mb-lg'>Mood-Based Discovery</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-gutter'>
						{MOODS.map((mood) => (
							<div
								key={mood.id}
								className='group relative p-lg rounded-xl bg-surface-container-low border border-outline-variant/20 overflow-hidden hover:bg-surface-container transition-all cursor-pointer'
							>
								<div className='flex gap-lg relative z-10'>
									<div className='w-32 h-32 rounded-lg overflow-hidden shadow-2xl flex-shrink-0'>
										<img
											src={mood.image}
											alt={mood.title}
											className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
										/>
									</div>
									<div className='flex flex-col justify-center'>
										<span className={`font-label-md text-label-md ${mood.labelColor} mb-xs`}>{mood.label}</span>
										<h3 className='font-title-md text-title-md text-on-surface mb-sm'>{mood.title}</h3>
										<p className='font-body-sm text-body-sm text-on-surface-variant max-w-xs'>
											{mood.subtitle}
										</p>
									</div>
								</div>
								<div className={`absolute -right-8 -bottom-8 w-40 h-40 ${mood.glowColor} blur-3xl transition-all rounded-full`} />
							</div>
						))}
					</div>
				</section>
			</div>

			{isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
		</>
	);
};

export default SearchPage;
