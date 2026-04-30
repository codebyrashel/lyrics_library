'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlaylistItem {
  id: string;
  title: string;
  type: 'local' | 'youtube';
  url?: string;
  videoId?: string;
  addedBy: string;
  addedAt: string;
  duration?: number;
  thumbnail?: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
}

interface RoomState {
  // Playlist
  playlist: PlaylistItem[];
  currentPlaying: PlaylistItem | null;
  currentIndex: number;
  
  // Player state
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  duration: number;
  isShuffling: boolean;
  repeatMode: 'none' | 'one' | 'all';
  
  // Chat & Participants
  messages: Message[];
  participants: Participant[];
  
  // Actions
  addToPlaylist: (item: PlaylistItem) => void;
  removeFromPlaylist: (id: string) => void;
  reorderPlaylist: (startIndex: number, endIndex: number) => void;
  playItem: (item: PlaylistItem) => void;
  playItemByIndex: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  playRandom: () => void;
  clearPlaylist: () => void;
  
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  
  sendMessage: (content: string) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  
  resetRoom: () => void;
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      // Initial state
      playlist: [],
      currentPlaying: null,
      currentIndex: -1,
      isPlaying: false,
      currentTime: 0,
      volume: 100,
      isMuted: false,
      playbackRate: 1,
      duration: 0,
      isShuffling: false,
      repeatMode: 'none',
      messages: [
        { id: '1', userId: 'system', userName: 'System', content: 'Welcome to the room', timestamp: new Date() }
      ],
      participants: [
        { id: '1', name: 'You', isHost: true }
      ],

      // Playlist actions
      addToPlaylist: (item) => {
        set((state) => ({
          playlist: [...state.playlist, { ...item, addedAt: new Date().toISOString() }]
        }));
      },

      removeFromPlaylist: (id) => {
        set((state) => {
          const newPlaylist = state.playlist.filter((item) => item.id !== id);
          let newCurrentPlaying = state.currentPlaying;
          let newCurrentIndex = state.currentIndex;
          
          // If we removed the current playing item, clear it or adjust
          if (state.currentPlaying?.id === id) {
            if (newPlaylist.length > 0 && newPlaylist.length > state.currentIndex) {
              newCurrentPlaying = newPlaylist[state.currentIndex];
            } else if (newPlaylist.length > 0) {
              newCurrentPlaying = newPlaylist[0];
              newCurrentIndex = 0;
            } else {
              newCurrentPlaying = null;
              newCurrentIndex = -1;
            }
          }
          
          return {
            playlist: newPlaylist,
            currentPlaying: newCurrentPlaying,
            currentIndex: newCurrentIndex
          };
        });
      },

      reorderPlaylist: (startIndex, endIndex) => {
        set((state) => {
          const result = Array.from(state.playlist);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          
          // Update current index if needed
          let newCurrentIndex = state.currentIndex;
          if (state.currentIndex === startIndex) {
            newCurrentIndex = endIndex;
          } else if (state.currentIndex > startIndex && state.currentIndex <= endIndex) {
            newCurrentIndex = state.currentIndex - 1;
          } else if (state.currentIndex < startIndex && state.currentIndex >= endIndex) {
            newCurrentIndex = state.currentIndex + 1;
          }
          
          return { playlist: result, currentIndex: newCurrentIndex };
        });
      },

      clearPlaylist: () => {
        set({ playlist: [], currentPlaying: null, currentIndex: -1 });
      },

      playItem: (item) => {
        const { playlist } = get();
        const index = playlist.findIndex((p) => p.id === item.id);
        set({
          currentPlaying: item,
          currentIndex: index,
          isPlaying: true,
          currentTime: 0,
          duration: 0
        });
      },

      playItemByIndex: (index) => {
        const { playlist } = get();
        if (index >= 0 && index < playlist.length) {
          set({
            currentPlaying: playlist[index],
            currentIndex: index,
            isPlaying: true,
            currentTime: 0,
            duration: 0
          });
        }
      },

      playNext: () => {
        const { playlist, currentIndex, repeatMode, isShuffling } = get();
        
        if (playlist.length === 0) return;
        
        let nextIndex = currentIndex + 1;
        
        // If at the end of playlist
        if (nextIndex >= playlist.length) {
          if (repeatMode === 'all') {
            nextIndex = 0; // Loop back to start
          } else {
            return; // Stop at end
          }
        }
        
        // Handle shuffle - pick random from remaining items not including current
        if (isShuffling) {
          const availableIndices = playlist
            .map((_, i) => i)
            .filter(i => i !== currentIndex);
          
          if (availableIndices.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            nextIndex = availableIndices[randomIndex];
          } else {
            return;
          }
        }
        
        set({
          currentPlaying: playlist[nextIndex],
          currentIndex: nextIndex,
          isPlaying: true,
          currentTime: 0,
          duration: 0
        });
      },

      playPrevious: () => {
        const { playlist, currentIndex, repeatMode } = get();
        
        if (playlist.length === 0) return;
        
        let prevIndex = currentIndex - 1;
        
        // If at start of playlist
        if (prevIndex < 0) {
          if (repeatMode === 'all') {
            prevIndex = playlist.length - 1; // Loop to end
          } else {
            return; // Stop at start
          }
        }
        
        set({
          currentPlaying: playlist[prevIndex],
          currentIndex: prevIndex,
          isPlaying: true,
          currentTime: 0,
          duration: 0
        });
      },

      playRandom: () => {
        const { playlist } = get();
        if (playlist.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * playlist.length);
        set({
          currentPlaying: playlist[randomIndex],
          currentIndex: randomIndex,
          isPlaying: true,
          currentTime: 0,
          duration: 0
        });
      },

      // Player actions
      setPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setVolume: (volume) => set({ volume }),
      setIsMuted: (isMuted) => set({ isMuted }),
      setPlaybackRate: (playbackRate) => set({ playbackRate }),
      setDuration: (duration) => set({ duration }),
      
      toggleShuffle: () => set((state) => ({ isShuffling: !state.isShuffling })),
      toggleRepeat: () => {
        set((state) => ({
          repeatMode: state.repeatMode === 'none' ? 'all' : state.repeatMode === 'all' ? 'one' : 'none'
        }));
      },

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

      // Participants actions
      addParticipant: (participant) => {
        set((state) => ({
          participants: [...state.participants, participant]
        }));
      },

      removeParticipant: (id) => {
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id)
        }));
      },

      resetRoom: () => {
        set({
          playlist: [],
          currentPlaying: null,
          currentIndex: -1,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          messages: [
            { id: '1', userId: 'system', userName: 'System', content: 'Welcome to the room', timestamp: new Date() }
          ]
        });
      }
    }),
    {
      name: 'lyrics_library_room',
      partialize: (state) => ({
        playlist: state.playlist,
        messages: state.messages,
        participants: state.participants
      })
    }
  )
);