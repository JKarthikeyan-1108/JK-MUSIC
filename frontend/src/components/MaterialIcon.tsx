interface MaterialIconProps {
	icon: string;
	filled?: boolean;
	className?: string;
	size?: number;
}

const MaterialIcon = ({ icon, filled = false, className = '', size }: MaterialIconProps) => {
	return (
		<span
			className={`material-symbols-outlined select-none ${className}`}
			style={{
				fontVariationSettings: filled ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : undefined,
				fontSize: size ? `${size}px` : undefined,
			}}
		>
			{icon}
		</span>
	);
};

export default MaterialIcon;
