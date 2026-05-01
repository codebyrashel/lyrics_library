import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlaylistItem, Message, Participant, RepeatMode } from './types';
import { initialPlaylistState, playlistActions } from './slices/playlistSlice';
import { initialPlayerState, playerActions } from './slices/playerSlice';
import { initialChatState, chatActions } from './slices/chatSlice';
import { initialParticipantsState, participantsActions } from './slices/participantsSlice';
import { createPlaylistActions } from './actions/playlistActions';

interface RoomState {
  // Playlist
  playlist: any[];
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
  repeatMode: RepeatMode;
  
  // Chat & Participants
  messages: Message[];
  participants: Participant[];
  
  // All actions
  addToPlaylist: (item: PlaylistItem) => void;
  removeFromPlaylist: (id: string) => void;
  reorderPlaylist: (startIndex: number, endIndex: number) => void;
  clearPlaylist: () => void;
  playItem: (item: PlaylistItem) => void;
  playItemByIndex: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  playRandom: () => void;
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
      ...initialPlaylistState,
      ...initialPlayerState,
      ...initialChatState,
      ...initialParticipantsState,

      // Actions
      ...playlistActions(set, get),
      ...playerActions(set, get),
      ...chatActions(set),
      ...participantsActions(set),
      ...createPlaylistActions(set, get),

      resetRoom: () => {
        set({
          ...initialPlaylistState,
          ...initialPlayerState,
          ...initialChatState,
          ...initialParticipantsState,
        });
      },
    }),
    {
      name: 'lyrics_library_room',
      partialize: (state) => ({
        playlist: state.playlist,
        messages: state.messages,
        participants: state.participants
      }),
    }
  )
);