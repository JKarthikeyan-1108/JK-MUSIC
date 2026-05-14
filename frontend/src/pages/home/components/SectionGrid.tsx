import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import PlayButton from "./PlayButton";

type SectionGridProps = {
	title: string;
	songs: Song[];
	isLoading: boolean;
};

const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
	if (isLoading) return <SectionGridSkeleton />;

	return (
		<div>
			<div className='flex justify-between items-end mb-md'>
				<h3 className='font-title-md text-title-md text-on-surface'>{title}</h3>
				<a className='text-label-md font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer'>
					Show all
				</a>
			</div>

			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-gutter'>
				{songs.map((song) => (
					<div
						key={song._id}
						className='group bg-surface-container-low p-md rounded-lg hover:bg-surface-container-high transition-all cursor-pointer relative'
					>
						<div className='relative aspect-square rounded-lg overflow-hidden mb-md shadow-lg'>
							<img
								src={song.imageUrl}
								alt={song.title}
								className='w-full h-full object-cover'
							/>
							<PlayButton song={song} />
						</div>
						<h4 className='font-title-md text-body-lg truncate text-on-surface'>
							{song.title}
						</h4>
						<p className='font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2'>
							{song.artist}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default SectionGrid;
