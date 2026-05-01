import { Message } from '../types';

export interface ChatSlice {
  messages: Message[];
}

export const initialChatState: ChatSlice = {
  messages: [
    { id: '1', userId: 'system', userName: 'System', content: 'Welcome to the room', timestamp: new Date() }
  ],
};

export const chatActions = (set: any) => ({
  sendMessage: (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      content,
      timestamp: new Date()
    };
    set((state: any) => ({
      messages: [...state.messages, newMessage]
    }));
  },
});