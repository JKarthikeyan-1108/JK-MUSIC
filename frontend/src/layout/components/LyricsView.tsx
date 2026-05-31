import { useEffect, useState, useRef } from "react";
import { axiosInstance } from "@/lib/axios";

interface LyricsViewProps {
	songId: string;
	currentTime: number;
	onSeek?: (time: number) => void;
}

interface LyricLine {
	time: number; // in seconds
	text: string;
}

const parseLRC = (lrc: string): LyricLine[] => {
	const lines = lrc.split("\n");
	const parsed: LyricLine[] = [];
	const timeRegex = /\[(\d{2}):(\d{2}(?:\.\d{2,3})?)\]/;

	lines.forEach((line) => {
		const match = timeRegex.exec(line);
		if (match) {
			const minutes = parseInt(match[1], 10);
			const seconds = parseFloat(match[2]);
			const text = line.replace(timeRegex, "").trim();
			if (text) {
				parsed.push({
					time: minutes * 60 + seconds,
					text,
				});
			}
		}
	});

	return parsed;
};

const LyricsView = ({ songId, currentTime, onSeek }: LyricsViewProps) => {
	const [lyrics, setLyrics] = useState<LyricLine[] | string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const containerRef = useRef<HTMLDivElement>(null);
	const activeLineRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		let isMounted = true;
		const fetchLyrics = async () => {
			setIsLoading(true);
			try {
				const res = await axiosInstance.get(`/songs/${songId}/lyrics`);
				if (!isMounted) return;
				const rawLyrics = res.data.lyrics;
				if (rawLyrics) {
					const parsed = parseLRC(rawLyrics);
					if (parsed.length > 0) {
						setLyrics(parsed);
					} else {
						setLyrics(rawLyrics); // Fallback to static text
					}
				} else {
					setLyrics(null);
				}
			} catch (error) {
				console.error("Failed to fetch lyrics", error);
				if (isMounted) setLyrics(null);
			} finally {
				if (isMounted) setIsLoading(false);
			}
		};

		fetchLyrics();
		return () => {
			isMounted = false;
		};
	}, [songId]);

	// Auto-scroll logic
	useEffect(() => {
		if (Array.isArray(lyrics) && activeLineRef.current && containerRef.current) {
			activeLineRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, [currentTime, lyrics]);

	if (isLoading) {
		return (
			<div className="flex-1 flex items-center justify-center h-full">
				<div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
			</div>
		);
	}

	if (!lyrics) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center h-full text-text-secondary">
				<span className="material-symbols-outlined text-5xl mb-4 opacity-50" style={{ fontVariationSettings: "'FILL' 0" }}>lyrics</span>
				<p className="text-body-lg font-bold">Looks like we don't have lyrics for this song.</p>
			</div>
		);
	}

	if (typeof lyrics === "string") {
		return (
			<div className="flex-1 overflow-y-auto no-scrollbar h-full px-4 text-center">
				<p className="text-display-sm font-bold leading-relaxed text-white whitespace-pre-wrap py-20">
					{lyrics}
				</p>
			</div>
		);
	}

	let activeIndex = lyrics.findIndex((line, index) => {
		const nextLine = lyrics[index + 1];
		if (!nextLine) return true;
		return currentTime >= line.time && currentTime < nextLine.time;
	});

	if (activeIndex === -1 && currentTime < lyrics[0]?.time) {
		activeIndex = -1; // Before first lyric
	}

	return (
		<div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar h-full px-4 md:px-8 py-32 relative mask-image-linear-vertical">
			<div className="max-w-2xl mx-auto flex flex-col gap-8">
				{lyrics.map((line, index) => {
					const isActive = index === activeIndex;
					const isPast = index < activeIndex;

					return (
						<p
							key={index}
							ref={isActive ? activeLineRef : null}
							onClick={() => onSeek && onSeek(line.time)}
							className={`text-display-md md:text-display-lg font-bold leading-tight cursor-pointer transition-all duration-500 transform ${
								isActive
									? "text-white scale-100 opacity-100 drop-shadow-lg"
									: isPast
									? "text-white/40 scale-[0.98] opacity-60 hover:text-white/80"
									: "text-black/30 scale-[0.98] blur-[0.5px] hover:text-white/60 hover:blur-none mix-blend-overlay"
							}`}
							style={
								!isActive && !isPast
									? { WebkitTextStroke: "1px rgba(255,255,255,0.3)" }
									: undefined
							}
						>
							{line.text}
						</p>
					);
				})}
			</div>
		</div>
	);
};

export default LyricsView;
