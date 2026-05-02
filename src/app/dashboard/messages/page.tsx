'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatArea } from '@/components/messages/ChatArea';
import { useMessages } from '@/hooks/useMessages';
import { getColors } from '@/store/colorStore';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
    const colors = getColors();
    const {
        conversations,
        selectedConversation,
        messages,
        isLoadingConversations,
        isLoadingMessages,
        selectConversation,
        sendMessage,
    } = useMessages();

    const handleSendMessage = async (content: string) => {
        if (!selectedConversation) return;
        await sendMessage(selectedConversation.participant.id, content);
    };

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
                            onSelect={selectConversation}
                            isLoading={isLoadingConversations}
                        />
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}