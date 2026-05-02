'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatArea } from '@/components/messages/ChatArea';
import { Conversation, Message } from '@/types/message';
import { messageService } from '@/services/message.service';
import { getColors } from '@/store/colorStore';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
  const colors = getColors();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    const response = await messageService.getConversations();
    if (response.success && response.conversations) {
      setConversations(response.conversations);
    }
    setIsLoadingConversations(false);
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    const response = await messageService.getMessages(conversationId);
    if (response.success && response.messages) {
      setMessages(response.messages);
      // Mark as read
      await messageService.markAsRead(conversationId);
    }
    setIsLoadingMessages(false);
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    const response = await messageService.sendMessage({
      receiverId: selectedConversation.participant.id,
      content,
    });

    if (response.success && response.message) {
      // Add new message to list
      setMessages([...messages, response.message]);
      
      // Update conversation list (update last message)
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: {
                  content,
                  timestamp: new Date().toISOString(),
                  isRead: false,
                  isFromMe: true,
                },
              }
            : conv
        )
      );
    }
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
              onSelect={handleSelectConversation}
              isLoading={isLoadingConversations}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}