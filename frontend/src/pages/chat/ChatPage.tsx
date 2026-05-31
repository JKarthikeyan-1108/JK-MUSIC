import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";

const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

const ChatPage = () => {
	const { user } = useUser();
	const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.clerkId);
	}, [selectedUser, fetchMessages]);

	console.log({ messages });

	return (
		<main className='h-full bg-background overflow-hidden flex flex-col relative'>
			{/* Ambient Gradient Background */}
			<div className="absolute inset-0 pointer-events-none z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-apple-red/5 via-background to-background" />
			</div>

			<div className="relative z-10 flex-shrink-0">
				<Topbar />
			</div>

			<div className='flex-1 grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] overflow-hidden relative z-10'>
				<div className="border-r border-separator apple-glass h-full">
					<UsersList />
				</div>

				{/* chat message */}
				<div className='flex flex-col h-full bg-background/50'>
					{selectedUser ? (
						<>
							<div className="flex-shrink-0 apple-glass-strong border-b border-separator">
								<ChatHeader />
							</div>

							{/* Messages */}
							<ScrollArea className='flex-1 p-4'>
								<div className='space-y-6 max-w-3xl mx-auto'>
									{messages.map((message) => (
										<div
											key={message._id}
											className={`flex items-end gap-3 ${
												message.senderId === user?.id ? "flex-row-reverse" : ""
											}`}
										>
											<Avatar className='size-8 shadow-sm flex-shrink-0'>
												<AvatarImage
													src={
														message.senderId === user?.id
															? user.imageUrl
															: selectedUser.imageUrl
													}
												/>
											</Avatar>

											<div
												className={`rounded-2xl p-3 px-4 max-w-[75%] shadow-sm
													${message.senderId === user?.id 
														? "bg-apple-red text-white rounded-br-sm" 
														: "apple-glass text-white rounded-bl-sm"}
												`}
											>
												<p className='text-body-md leading-relaxed'>{message.content}</p>
												<span className={`text-caption mt-1 block ${message.senderId === user?.id ? 'text-white/70' : 'text-text-secondary'}`}>
													{formatTime(message.createdAt)}
												</span>
											</div>
										</div>
									))}
								</div>
							</ScrollArea>

							<div className="flex-shrink-0 p-4 border-t border-separator apple-glass">
								<MessageInput />
							</div>
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
	);
};
export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6 opacity-80'>
		<div className="w-20 h-20 rounded-full bg-apple-red/10 flex items-center justify-center animate-pulse">
			<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-apple-red"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
		</div>
		<div className='text-center'>
			<h3 className='text-white text-title-md font-bold mb-1'>No conversation selected</h3>
			<p className='text-text-secondary text-body-md'>Choose a friend to start chatting</p>
		</div>
	</div>
);
