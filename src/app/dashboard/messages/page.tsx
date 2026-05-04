'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatArea } from '@/components/messages/ChatArea';
import { useMessages } from '@/hooks/useMessages';
import { getColors } from '@/store/colorStore';
import { MessageCircle, ArrowLeft } from 'lucide-react';

export default function MessagesPage() {
    const colors = getColors();
    const router = useRouter();
    const searchParams = useSearchParams();
    const friendId = searchParams.get('friendId');
    const friendName = searchParams.get('name');
    const friendUsername = searchParams.get('username');

    const [isMobileView, setIsMobileView] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const {
        conversations,
        selectedConversation,
        messages,
        isLoadingConversations,
        isLoadingMessages,
        selectConversation,
        sendMessage,
        startConversation,
        refreshConversations,
    } = useMessages();

    // Check screen size for mobile view
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Auto-start conversation when coming from friends page
    useEffect(() => {
        if (friendId && friendName && friendUsername) {
            // Check if conversation already exists
            const existingConv = conversations.find(c => c.participant.id === friendId);
            if (existingConv) {
                selectConversation(existingConv);
                if (isMobileView) setShowChat(true);
            } else {
                // Create a temporary conversation
                startConversation(friendId, friendName, friendUsername);
                if (isMobileView) setShowChat(true);
            }
            // Clear the URL params after processing
            router.replace('/dashboard/messages', { shallow: true });
        }
    }, [friendId, friendName, friendUsername, conversations, selectConversation, startConversation, isMobileView, router]);

    const handleSendMessage = async (content: string) => {
        if (!selectedConversation) return;

        const targetId = selectedConversation.participant.id;
        const success = await sendMessage(targetId, content);

        if (success) {
            // Refresh conversations to update the list
            await refreshConversations();
        }
        return success;
    };

    const handleSelectConversation = (conversation: any) => {
        selectConversation(conversation);
        if (isMobileView) setShowChat(true);
    };

    const handleBackToList = () => {
        setShowChat(false);
    };

    // Mobile view: show either list or chat
    if (isMobileView) {
        return (
            <DashboardLayout>
                <div className="h-[calc(100vh-120px)]">
                    {!showChat ? (
                        <div
                            className="h-full rounded-xl overflow-hidden flex flex-col"
                            style={{ backgroundColor: colors.surface }}
                        >
                            <div className="p-4 border-b" style={{ borderColor: `${colors.text.muted}20` }}>
                                <div className="flex items-center gap-2">
                                    <MessageCircle size={20} style={{ color: colors.primary }} />
                                    <h2 className="text-lg font-semibold" style={{ color: colors.text.primary }}>
                                        Messages
                                    </h2>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <ConversationList
                                    conversations={conversations}
                                    selectedId={selectedConversation?.id || null}
                                    onSelect={handleSelectConversation}
                                    isLoading={isLoadingConversations}
                                />
                            </div>
                        </div>
                    ) : (
                        <div
                            className="h-full rounded-xl overflow-hidden flex flex-col"
                            style={{ backgroundColor: colors.surface }}
                        >
                            <div className="p-3 border-b flex items-center gap-3" style={{ borderColor: `${colors.text.muted}20` }}>
                                <button
                                    onClick={handleBackToList}
                                    className="p-1 rounded-lg"
                                    style={{ color: colors.text.primary }}
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                                        style={{ backgroundColor: colors.primary }}
                                    >
                                        {selectedConversation?.participant.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold" style={{ color: colors.text.primary }}>
                                            {selectedConversation?.participant.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <ChatArea
                                conversation={selectedConversation}
                                messages={messages}
                                onSendMessage={handleSendMessage}
                                isLoading={isLoadingMessages}
                            />
                        </div>
                    )}
                </div>
            </DashboardLayout>
        );
    }

    // Desktop view: show both sidebar and chat
    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-120px)] flex gap-4">


                {/* Chat Area */}
                <div
                    className="flex-1 rounded-xl overflow-hidden flex flex-col"
                    style={{ backgroundColor: colors.surface }}
                >
                    <ChatArea
                        conversation={selectedConversation}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoadingMessages}
                    />
                </div>

                {/* Conversations Sidebar */}
                <div
                    className="w-80 rounded-xl overflow-hidden flex flex-col"
                    style={{ backgroundColor: colors.surface }}
                >
                    <div className="p-4 border-b" style={{ borderColor: `${colors.text.muted}20` }}>
                        <div className="flex items-center gap-2">
                            <MessageCircle size={20} style={{ color: colors.primary }} />
                            <h2 className="text-lg font-semibold" style={{ color: colors.text.primary }}>
                                Messages
                            </h2>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <ConversationList
                            conversations={conversations}
                            selectedId={selectedConversation?.id || null}
                            onSelect={handleSelectConversation}
                            isLoading={isLoadingConversations}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}