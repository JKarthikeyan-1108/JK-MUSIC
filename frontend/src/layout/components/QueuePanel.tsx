import { usePlayerStore } from "@/stores/usePlayerStore";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QueuePanelProps {
	onClose: () => void;
}

const QueuePanel = ({ onClose }: QueuePanelProps) => {
	const { queue, currentSong, currentIndex, playAlbum, removeFromQueue } = usePlayerStore();

	// Calculate what's next
	const upNext = queue.slice(currentIndex + 1);

	return (
		<div className='fixed inset-y-0 right-0 w-full sm:w-[400px] apple-glass/95 backdrop-blur-3xl border-l border-separator/30 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300'>
			{/* Header */}
			<div className='flex items-center justify-between p-lg border-b border-separator/30'>
				<h2 className='font-title-lg text-title-lg font-bold text-white'>Queue</h2>
				<button
					onClick={onClose}
					className='w-10 h-10 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors'
				>
					<span className='material-symbols-outlined'>close</span>
				</button>
			</div>

			<ScrollArea className='flex-1'>
				<div className='p-lg'>
					{/* Currently Playing */}
					{currentSong && (
						<div className='mb-xl'>
							<h3 className='font-label-md text-label-md text-text-secondary mb-md uppercase tracking-wider'>
								Now Playing
							</h3>
							<div className='flex items-center gap-md p-md rounded-lg bg-apple-red/10 border border-primary/20 group'>
								<img
									src={currentSong.imageUrl}
									alt={currentSong.title}
									className='w-12 h-12 rounded-md object-cover shadow-md'
								/>
								<div className='flex-1 min-w-0'>
									<p className='font-title-md text-body-lg text-apple-red font-bold truncate'>
										{currentSong.title}
									</p>
									<p className='font-body-sm text-body-sm text-apple-red/80 truncate'>
										{currentSong.artist}
									</p>
								</div>
								<span className='material-symbols-outlined text-apple-red' style={{ fontVariationSettings: "'FILL' 1" }}>
									equalizer
								</span>
							</div>
						</div>
					)}

					{/* Up Next */}
					<div>
						<h3 className='font-label-md text-label-md text-text-secondary mb-md uppercase tracking-wider'>
							Next In Queue
						</h3>
						{upNext.length === 0 ? (
							<div className='flex flex-col items-center justify-center py-xl text-text-secondary/50'>
								<span className='material-symbols-outlined text-[48px] mb-sm'>queue_music</span>
								<p>Your queue is empty</p>
							</div>
						) : (
							<div className='flex flex-col gap-2'>
								{upNext.map((song, index) => (
									<div
										key={song._id + index}
										className='flex items-center gap-md p-sm rounded-lg hover:bg-surface-container-high transition-colors group cursor-pointer'
										onClick={() => playAlbum(queue, currentIndex + 1 + index)}
									>
										<div className='relative w-12 h-12 rounded-md overflow-hidden shrink-0'>
											<img
												src={song.imageUrl}
												alt={song.title}
												className='w-full h-full object-cover'
											/>
											<div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
												<span className='material-symbols-outlined text-white' style={{ fontVariationSettings: "'FILL' 1" }}>
													play_arrow
												</span>
											</div>
										</div>
										<div className='flex-1 min-w-0'>
											<p className='font-body-lg text-body-lg text-white truncate group-hover:text-apple-red transition-colors'>
												{song.title}
											</p>
											<p className='font-body-sm text-body-sm text-text-secondary truncate'>
												{song.artist}
											</p>
										</div>
										<button
											onClick={(e) => {
												e.stopPropagation();
												removeFromQueue(song._id);
											}}
											className='w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-text-secondary hover:text-error'
										>
											<span className='material-symbols-outlined text-[20px]'>delete</span>
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};

export default QueuePanel;
