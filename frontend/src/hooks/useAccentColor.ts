import { useEffect, useState } from "react";
import ColorThief from "color-thief-ts";

export const useAccentColor = (imageUrl: string | null | undefined): string => {
	const [color, setColor] = useState<string>("#fc3c44");

	useEffect(() => {
		if (!imageUrl) {
			setColor("#fc3c44");
			document.documentElement.style.setProperty("--accent-color", "#fc3c44");
			return;
		}

		const img = new Image();
		img.crossOrigin = "Anonymous";
		
		// To avoid cache issues with CORS, append a timestamp if not already there
		// Not strictly necessary for Cloudinary if headers are correct, but safe
		img.src = imageUrl;

		img.onload = () => {
			try {
				const colorThief = new ColorThief();
				const rgb = colorThief.getColor(img);
				const hex = `#${rgb[0].toString(16).padStart(2, "0")}${rgb[1]
					.toString(16)
					.padStart(2, "0")}${rgb[2].toString(16).padStart(2, "0")}`;
				setColor(hex);
				document.documentElement.style.setProperty("--accent-color", hex);
			} catch (e) {
				console.error("Error extracting color:", e);
				setColor("#fc3c44");
				document.documentElement.style.setProperty("--accent-color", "#fc3c44");
			}
		};

		img.onerror = () => {
			setColor("#fc3c44");
			document.documentElement.style.setProperty("--accent-color", "#fc3c44");
		};
	}, [imageUrl]);

	return color;
};

export const getDominantGradient = (hex: string): string => {
	return `linear-gradient(180deg, ${hex}33 0%, transparent 100%)`;
};
