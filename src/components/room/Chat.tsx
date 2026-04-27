'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useRoom } from '@/contexts/RoomContext';

export const Chat = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const colors = getColors();
  const { messages, sendMessage } = useRoom();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div 
      className="flex flex-col h-full rounded-xl"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div className="p-3 border-b" style={{ borderColor: `${colors.text.muted}20` }}>
        <h3 className="font-semibold" style={{ color: colors.text.primary }}>Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-2">
            <span className="text-xs font-semibold" style={{ color: colors.primary }}>
              {msg.userName}:
            </span>
            <span className="text-sm" style={{ color: colors.text.secondary }}>
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t flex gap-2" style={{ borderColor: `${colors.text.muted}20` }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
          style={{
            backgroundColor: colors.background,
            color: colors.text.primary
          }}
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-lg transition-all hover:scale-105"
          style={{ backgroundColor: colors.primary, color: 'white' }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};