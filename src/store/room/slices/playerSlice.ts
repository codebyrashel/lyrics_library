import { RepeatMode } from '../types';

export interface PlayerSlice {
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  duration: number;
  isShuffling: boolean;
  repeatMode: RepeatMode;
}

export const initialPlayerState: PlayerSlice = {
  isPlaying: false,
  currentTime: 0,
  volume: 100,
  isMuted: false,
  playbackRate: 1,
  duration: 0,
  isShuffling: false,
  repeatMode: 'none',
};

export const playerActions = (set: any, get: any) => ({
  setPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setVolume: (volume: number) => set({ volume }),
  setIsMuted: (isMuted: boolean) => set({ isMuted }),
  setPlaybackRate: (playbackRate: number) => set({ playbackRate }),
  setDuration: (duration: number) => set({ duration }),
  
  toggleShuffle: () => set((state: any) => ({ isShuffling: !state.isShuffling })),
  toggleRepeat: () => {
    set((state: any) => ({
      repeatMode: state.repeatMode === 'none' ? 'all' : state.repeatMode === 'all' ? 'one' : 'none'
    }));
  },
});