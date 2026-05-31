/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"apple-red": "#fc3c44",
				"apple-red-hover": "#ff4d55",
				"apple-red-dark": "#d4323a",
				
				// Backgrounds
				"bg-primary": "#000000",
				"bg-secondary": "#0d0d0d",
				"bg-tertiary": "#1a1a1a",
				"bg-card": "#1c1c1e",
				"bg-elevated": "#2c2c2e",
				
				// Glass layers
				"glass-1": "rgba(28,28,30,0.7)",
				"glass-2": "rgba(44,44,46,0.6)",
				"glass-3": "rgba(58,58,60,0.5)",
				
				// Text
				"text-primary": "#ffffff",
				"text-secondary": "rgba(255,255,255,0.7)",
				"text-tertiary": "rgba(255,255,255,0.45)",
				"text-disabled": "rgba(255,255,255,0.25)",
				
				// Separators
				"separator": "rgba(255,255,255,0.08)",
				"separator-strong": "rgba(255,255,255,0.16)",

				// ShadCN compat tokens
				foreground: "#ffffff",
				card: {
					DEFAULT: "#1c1c1e",
					foreground: "#ffffff",
				},
				popover: {
					DEFAULT: "#000000",
					foreground: "#ffffff",
				},
				muted: {
					DEFAULT: "#2c2c2e",
					foreground: "rgba(255,255,255,0.7)",
				},
				accent: {
					DEFAULT: "#fc3c44",
					foreground: "#ffffff",
				},
				destructive: {
					DEFAULT: "#fc3c44",
					foreground: "#ffffff",
				},
				border: "rgba(255,255,255,0.08)",
				input: "rgba(255,255,255,0.16)",
				ring: "#fc3c44",
			},
			fontFamily: {
				sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Arial", "sans-serif"],
				display: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "sans-serif"],
			},
			fontSize: {
				"display-xl": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
				"display-lg": ["2.5rem", { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "700" }],
				"display-md": ["2rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
				"title-lg": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" }],
				"title-md": ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
				"title-sm": ["1.0625rem", { lineHeight: "1.35", letterSpacing: "-0.005em", fontWeight: "600" }],
				"body-lg": ["1rem", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
				"body-md": ["0.9375rem", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
				caption: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "400" }],
				overline: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.06em", fontWeight: "600", textTransform: "uppercase" }],
			},
			borderRadius: {
				card: "12px",
				sheet: "16px",
				pill: "9999px",
				button: "10px",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
