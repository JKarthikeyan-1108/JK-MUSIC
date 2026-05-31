import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

const AdminPage = () => {
	const { isAdmin, isLoading } = useAuthStore();

	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		fetchStats();
	}, [fetchAlbums, fetchSongs, fetchStats]);

	if (!isAdmin && !isLoading) return <div className="h-full flex items-center justify-center text-white">Unauthorized</div>;

	return (
		<div
			className='min-h-full bg-background text-white p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto overflow-y-auto no-scrollbar pb-32'
		>
			<Header />

			<DashboardStats />

			<Tabs defaultValue='songs' className='space-y-8'>
				<TabsList className='p-1 apple-glass inline-flex rounded-full h-auto'>
					<TabsTrigger 
						value='songs' 
						className='rounded-full px-6 py-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-text-secondary hover:text-white transition-all'
					>
						<Music className='mr-2 size-4' />
						Songs
					</TabsTrigger>
					<TabsTrigger 
						value='albums' 
						className='rounded-full px-6 py-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-text-secondary hover:text-white transition-all'
					>
						<Album className='mr-2 size-4' />
						Albums
					</TabsTrigger>
				</TabsList>

				<TabsContent value='songs' className="outline-none">
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='albums' className="outline-none">
					<AlbumsTabContent />
				</TabsContent>
			</Tabs>
		</div>
	);
};
export default AdminPage;
