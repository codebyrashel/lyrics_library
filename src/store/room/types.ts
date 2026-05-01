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

export type RepeatMode = 'none' | 'one' | 'all';