'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

interface QueueItem {
  id: string;
  title: string;
  type: 'local' | 'youtube';
  url?: string;
  videoId?: string;
  addedBy: string;
}

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
}

interface RoomContextType {
  messages: Message[];
  sendMessage: (content: string) => void;
  queue: QueueItem[];
  addToQueue: (item: QueueItem) => void;
  removeFromQueue: (id: string) => void;
  participants: Participant[];
  currentPlaying: QueueItem | null;
  setCurrentPlaying: (item: QueueItem | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within RoomProvider');
  }
  return context;
};

export const RoomProvider = ({ children, roomId }: { children: ReactNode; roomId: string }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', userId: 'system', userName: 'System', content: 'Welcome to the room!', timestamp: new Date() }
  ]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'You', isHost: true }
  ]);
  const [currentPlaying, setCurrentPlaying] = useState<QueueItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const sendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addToQueue = (item: QueueItem) => {
    setQueue(prev => [...prev, item]);
  };

  const removeFromQueue = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  return (
    <RoomContext.Provider value={{
      messages, sendMessage, queue, addToQueue, removeFromQueue,
      participants, currentPlaying, setCurrentPlaying, isPlaying, setIsPlaying,
      currentTime, setCurrentTime
    }}>
      {children}
    </RoomContext.Provider>
  );
};