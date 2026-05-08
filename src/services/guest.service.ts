// Guest session management for non-authenticated users

const GUEST_ID_KEY = 'guest_session_id';
const GUEST_ACTIVITY_KEY = 'guest_activity';
const GUEST_ROOMS_KEY = 'guest_rooms';

export interface GuestActivity {
  sessionId: string;
  roomsCreated: number;
  roomsJoined: number;
  totalWatchTime: number;
  messagesSent: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface GuestRoom {
  roomId: string;
  roomName: string;
  createdAt: string;
  isHost: boolean;
}

export const guestService = {
  // Get or create guest session ID
  getGuestId(): string {
    let guestId = localStorage.getItem(GUEST_ID_KEY);
    if (!guestId) {
      guestId = this.generateGuestId();
      localStorage.setItem(GUEST_ID_KEY, guestId);
      this.initActivity(guestId);
    }
    return guestId;
  },

  // Generate a unique guest ID
  generateGuestId(): string {
    return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  },

  // Initialize guest activity tracking
  initActivity(guestId: string): void {
    const activity: GuestActivity = {
      sessionId: guestId,
      roomsCreated: 0,
      roomsJoined: 0,
      totalWatchTime: 0,
      messagesSent: 0,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    localStorage.setItem(GUEST_ACTIVITY_KEY, JSON.stringify(activity));
  },

  // Get guest activity
  getActivity(): GuestActivity | null {
    const data = localStorage.getItem(GUEST_ACTIVITY_KEY);
    if (!data) return null;
    return JSON.parse(data);
  },

  // Update guest activity
  updateActivity(updates: Partial<GuestActivity>): void {
    const activity = this.getActivity();
    if (activity) {
      const updated = { ...activity, ...updates, lastActiveAt: new Date().toISOString() };
      localStorage.setItem(GUEST_ACTIVITY_KEY, JSON.stringify(updated));
    }
  },

  // Save guest room
  saveGuestRoom(roomId: string, roomName: string, isHost: boolean): void {
    const rooms = this.getGuestRooms();
    const existingIndex = rooms.findIndex(r => r.roomId === roomId);
    
    const room: GuestRoom = {
      roomId,
      roomName,
      createdAt: new Date().toISOString(),
      isHost,
    };
    
    if (existingIndex !== -1) {
      rooms[existingIndex] = room;
    } else {
      rooms.unshift(room);
    }
    
    // Keep only last 20 rooms
    const trimmedRooms = rooms.slice(0, 20);
    localStorage.setItem(GUEST_ROOMS_KEY, JSON.stringify(trimmedRooms));
  },

  // Get guest rooms
  getGuestRooms(): GuestRoom[] {
    const data = localStorage.getItem(GUEST_ROOMS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  },

  // Check if user is a guest
  isGuest(): boolean {
    const token = localStorage.getItem('auth_token');
    return !token || token === '';
  },

  // Get guest token for API requests
  getGuestToken(): string {
    return this.getGuestId();
  },

  // Increment rooms created count (for tracking only)
  incrementRoomsCreated(): void {
    const activity = this.getActivity();
    if (activity) {
      this.updateActivity({ roomsCreated: activity.roomsCreated + 1 });
    }
  },

  // Increment rooms joined count (for tracking only)
  incrementRoomsJoined(): void {
    const activity = this.getActivity();
    if (activity) {
      this.updateActivity({ roomsJoined: activity.roomsJoined + 1 });
    }
  },

  // Clear guest data (when user signs up)
  clearGuestData(): void {
    localStorage.removeItem(GUEST_ID_KEY);
    localStorage.removeItem(GUEST_ACTIVITY_KEY);
    localStorage.removeItem(GUEST_ROOMS_KEY);
  },
};