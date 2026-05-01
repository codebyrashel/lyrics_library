export const createPlaylistActions = (set: any, get: any) => ({
  playItem: (item: any) => {
    const { playlist } = get();
    const index = playlist.findIndex((p: any) => p.id === item.id);
    set({
      currentPlaying: item,
      currentIndex: index,
      isPlaying: true,
      currentTime: 0,
      duration: 0
    });
  },

  playItemByIndex: (index: number) => {
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
    
    if (nextIndex >= playlist.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
    }
    
    if (isShuffling) {
      const availableIndices = playlist
        .map((_: any, i: number) => i)
        .filter((i: number) => i !== currentIndex);
      
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
    
    if (prevIndex < 0) {
      if (repeatMode === 'all') {
        prevIndex = playlist.length - 1;
      } else {
        return;
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
});