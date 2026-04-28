'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface QueueItem {
  id: string;
  title: string;
  type: 'local' | 'youtube';
  url?: string;
  videoId?: string;
  addedBy: string;
}

export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
}

interface RoomState {
  // State
  messages: Message[];
  queue: QueueItem[];
  history: QueueItem[];
  participants: Participant[];
  currentPlaying: QueueItem | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  duration: number;
  
  // Actions
  sendMessage: (content: string) => void;
  addToQueue: (item: QueueItem) => void;
  removeFromQueue: (id: string) => void;
  playNext: () => void;
  playPrevious: () => void;
  playItem: (item: QueueItem) => void;
  
  // Player Actions
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setDuration: (duration: number) => void;
  
  // Reset
  resetRoom: () => void;
}

export const useRoomStore = create<RoomState>()(
  (set, get) => ({
    // Initial state
    messages: [
      { id: '1', userId: 'system', userName: 'System', content: 'Welcome to the room!', timestamp: new Date() }
    ],
    queue: [],
    history: [],
    participants: [
      { id: '1', name: 'You', isHost: true }
    ],
    currentPlaying: null,
    isPlaying: false,
    currentTime: 0,
    volume: 100,
    isMuted: false,
    playbackRate: 1,
    duration: 0,

    // Chat actions
    sendMessage: (content) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        userId: 'current-user',
        userName: 'You',
        content,
        timestamp: new Date()
      };
      set((state) => ({
        messages: [...state.messages, newMessage]
      }));
    },

    // Queue actions
    addToQueue: (item) => {
      set((state) => ({
        queue: [...state.queue, item]
      }));
    },

    removeFromQueue: (id) => {
      set((state) => ({
        queue: state.queue.filter((item) => item.id !== id)
      }));
    },

    playItem: (item) => {
      const { currentPlaying } = get();
      
      // Add current to history if exists
      if (currentPlaying) {
        set((state) => ({
          history: [currentPlaying, ...state.history].slice(0, 50)
        }));
      }
      
      // Remove from queue if present
      set((state) => ({
        currentPlaying: item,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        queue: state.queue.filter((q) => q.id !== item.id)
      }));
    },

    playNext: () => {
      const { queue, currentPlaying, history } = get();
      
      if (queue.length === 0) return;
      
      // Add current to history
      if (currentPlaying) {
        set((state) => ({
          history: [currentPlaying, ...state.history].slice(0, 50)
        }));
      }
      
      const nextItem = queue[0];
      const remainingQueue = queue.slice(1);
      
      set({
        currentPlaying: nextItem,
        queue: remainingQueue,
        isPlaying: true,
        currentTime: 0,
        duration: 0
      });
    },

    playPrevious: () => {
      const { history, currentPlaying, queue } = get();
      
      if (history.length === 0) return;
      
      // Add current back to front of queue
      if (currentPlaying) {
        set((state) => ({
          queue: [currentPlaying, ...state.queue]
        }));
      }
      
      const previousItem = history[0];
      const remainingHistory = history.slice(1);
      
      set({
        currentPlaying: previousItem,
        history: remainingHistory,
        isPlaying: true,
        currentTime: 0,
        duration: 0
      });
    },

    // Player actions
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    setCurrentTime: (time) => set({ currentTime: time }),
    setVolume: (volume) => set({ volume }),
    setIsMuted: (isMuted) => set({ isMuted }),
    setPlaybackRate: (playbackRate) => set({ playbackRate }),
    setDuration: (duration) => set({ duration }),

    // Reset
    resetRoom: () => {
      set({
        messages: [
          { id: '1', userId: 'system', userName: 'System', content: 'Welcome to the room!', timestamp: new Date() }
        ],
        queue: [],
        history: [],
        currentPlaying: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0
      });
    }
  })
);