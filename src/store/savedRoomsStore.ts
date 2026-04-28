'use client';

export interface SavedRoom {
  id: string;
  name: string;
  createdAt: string;
  lastVisited: string;
  isActive: boolean;
  participantCount?: number;
  isCreator: boolean;
}

const STORAGE_KEY = 'lyrics_library_rooms';

export const getSavedRooms = (): SavedRoom[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveRoom = (room: SavedRoom) => {
  const rooms = getSavedRooms();
  const existingIndex = rooms.findIndex(r => r.id === room.id);
  
  if (existingIndex !== -1) {
    rooms[existingIndex] = { ...rooms[existingIndex], ...room };
  } else {
    rooms.unshift(room);
  }
  
  const trimmedRooms = rooms.slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedRooms));
  return trimmedRooms;
};

export const updateRoomLastVisited = (roomId: string) => {
  const rooms = getSavedRooms();
  const room = rooms.find(r => r.id === roomId);
  if (room) {
    room.lastVisited = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  }
};

export const removeRoom = (roomId: string) => {
  const rooms = getSavedRooms().filter(r => r.id !== roomId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  return rooms;
};