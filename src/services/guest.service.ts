// Guest session management for non-authenticated users

const GUEST_ID_KEY = 'guest_session_id';
const GUEST_ACTIVITY_KEY = 'guest_activity';
const GUEST_ROOMS_KEY = 'guest_rooms';
const GUEST_NAME_KEY = 'guest_name';

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

// Helper to check if code is running on client side
const isClient = typeof window !== 'undefined';

// Store generated name to avoid repeated async calls
let cachedGuestName: string | null = null;

export const guestService = {
  // Get or create guest session ID
  getGuestId(): string {
    if (!isClient) {
      return '';
    }
    
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

  // Generate a random guest name (synchronous version for immediate use)
  generateRandomGuestName(): string {
    const adjectives = [
      'Happy', 'Sleepy', 'Clever', 'Brave', 'Swift', 'Calm', 'Bold', 'Wise',
      'Crazy', 'Quiet', 'Loud', 'Funny', 'Kind', 'Wild', 'Gentle', 'Mighty',
      'Speedy', 'Lucky', 'Jolly', 'Zesty', 'Cozy', 'Snappy', 'Dandy', 'Perky',
      'Breezy', 'Chipper', 'Dizzy', 'Froggy', 'Grumpy', 'Hoppy', 'Jumpy', 'Loopy'
    ];

    const nouns = [
      'Panda', 'Koala', 'Fox', 'Wolf', 'Owl', 'Hawk', 'Bear', 'Deer',
      'Frog', 'Duck', 'Goose', 'Horse', 'Mouse', 'Rabbit', 'Squirrel', 'Raccoon',
      'Penguin', 'Dolphin', 'Octopus', 'Crab', 'Lobster', 'Starfish', 'Jellyfish', 'Seahorse',
      'Eagle', 'Falcon', 'Raven', 'Crow', 'Sparrow', 'Finch', 'Robin', 'Bluebird'
    ];

    const getRandomItem = (arr: string[]): string => {
      return arr[Math.floor(Math.random() * arr.length)];
    };

    const getRandomNumber = (): number => {
      return Math.floor(Math.random() * 999) + 1;
    };

    const adjective = getRandomItem(adjectives);
    const noun = getRandomItem(nouns);
    const number = getRandomNumber();
    
    return `${adjective}${noun}${number}`;
  },

  // Get guest display name (synchronous, uses cached generator)
  getGuestName(): string {
    if (!isClient) return 'Guest';
    
    if (cachedGuestName) {
      return cachedGuestName;
    }
    
    let guestName = localStorage.getItem(GUEST_NAME_KEY);
    if (!guestName) {
      guestName = this.generateRandomGuestName();
      localStorage.setItem(GUEST_NAME_KEY, guestName);
    }
    
    cachedGuestName = guestName;
    return guestName;
  },

  // Get guest name from URL parameter (from backend response)
  getGuestNameFromUrl(): string | null {
    if (!isClient) return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('guestName');
    return guestName;
  },

  // Sync guest name with backend-generated name
  syncGuestNameWithBackend(backendGuestName: string): void {
    if (!isClient) return;
    
    // Only update if the backend provided a different name
    const currentName = this.getGuestName();
    if (currentName !== backendGuestName) {
      console.log(`Syncing guest name: "${currentName}" -> "${backendGuestName}"`);
      cachedGuestName = backendGuestName;
      localStorage.setItem(GUEST_NAME_KEY, backendGuestName);
    }
  },

  // Set guest name (if you want to allow customization later)
  setGuestName(name: string): void {
    if (!isClient) return;
    cachedGuestName = name;
    localStorage.setItem(GUEST_NAME_KEY, name);
  },

  // Clear cached guest name (useful for testing or logout)
  clearGuestNameCache(): void {
    cachedGuestName = null;
  },

  // Initialize guest activity tracking
  initActivity(guestId: string): void {
    if (!isClient) return;
    
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
    if (!isClient) return null;
    
    const data = localStorage.getItem(GUEST_ACTIVITY_KEY);
    if (!data) return null;
    return JSON.parse(data);
  },

  // Update guest activity
  updateActivity(updates: Partial<GuestActivity>): void {
    if (!isClient) return;
    
    const activity = this.getActivity();
    if (activity) {
      const updated = { ...activity, ...updates, lastActiveAt: new Date().toISOString() };
      localStorage.setItem(GUEST_ACTIVITY_KEY, JSON.stringify(updated));
    }
  },

  // Save guest room
  saveGuestRoom(roomId: string, roomName: string, isHost: boolean): void {
    if (!isClient) return;
    
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
    if (!isClient) return [];
    
    const data = localStorage.getItem(GUEST_ROOMS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  },

  // Check if user is a guest
  isGuest(): boolean {
    if (!isClient) {
      return false;
    }
    const token = localStorage.getItem('auth_token');
    return !token || token === '';
  },

  // Get guest token for API requests
  getGuestToken(): string {
    return this.getGuestId();
  },

  // Increment rooms created count (for tracking only)
  incrementRoomsCreated(): void {
    if (!isClient) return;
    
    const activity = this.getActivity();
    if (activity) {
      this.updateActivity({ roomsCreated: activity.roomsCreated + 1 });
    }
  },

  // Increment rooms joined count (for tracking only)
  incrementRoomsJoined(): void {
    if (!isClient) return;
    
    const activity = this.getActivity();
    if (activity) {
      this.updateActivity({ roomsJoined: activity.roomsJoined + 1 });
    }
  },

  // Clear guest data (when user signs up)
  clearGuestData(): void {
    if (!isClient) return;
    
    localStorage.removeItem(GUEST_ID_KEY);
    localStorage.removeItem(GUEST_ACTIVITY_KEY);
    localStorage.removeItem(GUEST_ROOMS_KEY);
    localStorage.removeItem(GUEST_NAME_KEY);
    cachedGuestName = null;
  },

  // Get remaining rooms for guest (max 3)
  getRemainingRooms(): number {
    if (!isClient) return 3;
    
    const activity = this.getActivity();
    if (!activity) return 3;
    const created = activity.roomsCreated || 0;
    const joined = activity.roomsJoined || 0;
    const total = created + joined;
    return Math.max(0, 3 - total);
  },
};