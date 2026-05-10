// src/types/participant.ts

export interface Participant {
  id: string;
  name: string;
  username: string;
  isHost: boolean;
  isSpeaking?: boolean;
  isTyping?: boolean;
  avatar?: string;  
  isGuest?: boolean;
  guestName?: string;
  role?: string;
  joinedAt?: string;
}