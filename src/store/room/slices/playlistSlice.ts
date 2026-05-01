import { PlaylistItem } from '../types';

export interface PlaylistSlice {
  playlist: PlaylistItem[];
  currentPlaying: PlaylistItem | null;
  currentIndex: number;
}

export const initialPlaylistState: PlaylistSlice = {
  playlist: [],
  currentPlaying: null,
  currentIndex: -1,
};

export const playlistActions = (set: any, get: any) => ({
  addToPlaylist: (item: PlaylistItem) => {
    set((state: any) => ({
      playlist: [...state.playlist, { ...item, addedAt: new Date().toISOString() }]
    }));
  },

  removeFromPlaylist: (id: string) => {
    set((state: any) => {
      const newPlaylist = state.playlist.filter((item: PlaylistItem) => item.id !== id);
      let newCurrentPlaying = state.currentPlaying;
      let newCurrentIndex = state.currentIndex;
      
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

  reorderPlaylist: (startIndex: number, endIndex: number) => {
    set((state: any) => {
      const result = Array.from(state.playlist);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
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
});