import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId } = useAuth();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();

	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = await getToken();
				updateApiToken(token);
				if (token) {
					await checkAdminStatus();
					// init socket
					if (userId) initSocket(userId);
				}
			} catch (error: any) {
				updateApiToken(null);
				console.log("Error in auth provider", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// clean up
		return () => disconnectSocket();
	}, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

	if (loading)
		return (
			<div className='h-screen w-full bg-background flex flex-col items-center justify-center gap-lg'>
				<div className='relative'>
					<div className='w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center border border-outline-variant/30'>
						<span className='material-symbols-outlined text-primary text-[32px]' style={{ fontVariationSettings: "'FILL' 1" }}>
							graphic_eq
						</span>
					</div>
					<div className='absolute inset-[-6px] rounded-full border-2 border-primary/30 border-t-primary animate-spin' style={{ animationDuration: '1.2s' }} />
				</div>
				<p className='font-body-sm text-body-sm text-on-surface-variant'>Loading Melodix...</p>
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
