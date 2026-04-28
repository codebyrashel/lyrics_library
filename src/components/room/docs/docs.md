The Room feature is a synchronized viewing platform that allows users to watch YouTube videos and local media together with friends. It includes real-time chat, queue management, playback controls, and participant management.


```
src/
├── store/
│   ├── roomStore.ts           # Zustand store for active room state
│   └── savedRoomsStore.ts     # Persistent storage for room history
├── components/room/
│   ├── VideoPlayer.tsx        # Main video player with controls
│   ├── Queue.tsx              # Queue list component
│   ├── Chat.tsx               # Real-time chat component
│   ├── Participants.tsx       # Participants list component
│   ├── AddMedia.tsx           # Add YouTube/local media component
│   └── LeaveRoomModal.tsx     # Leave confirmation modal
└── app/room/[roomId]/
    └── page.tsx               # Room page layout
```

## State Management (Zustand Store)

File: src/store/roomStore.ts

### State Variables

| Variable       | Type                | Description                                   |
|----------------|---------------------|-----------------------------------------------|
| messages       | Message[]           | Array of chat messages                        |
| queue          | QueueItem[]         | Array of queued media items                   |
| history        | QueueItem[]         | Previously played items (max 50)              |
| participants   | Participant[]       | Array of room participants                    |
| currentPlaying | QueueItem \| null   | Currently playing media                       |
| isPlaying      | boolean             | Playback state                                |
| currentTime    | number              | Current playback position (seconds)           |
| volume         | number              | Volume level (0–100)                          |
| isMuted        | boolean             | Mute state                                    |
| playbackRate   | number              | Playback speed (0.5, 0.75, 1, 1.25, 1.5, 2)   |
| duration       | number              | Total duration of current media               |

### Queue Item Structure

```
interface QueueItem {
  id: string;                       // Unique identifier (timestamp)
  title: string;                    // Display title
  type: 'local' | 'youtube';        // Media source
  url?: string;                     // Local file blob URL
  videoId?: string;                 // YouTube video ID
  addedBy: string;                  // Who added this item
}
```

### Message Structure:
```
interface Message {
  id: string;           // Unique identifier
  userId: string;       // User identifier
  userName: string;     // Display name
  content: string;      // Message text
  timestamp: Date;      // When sent
}
```

### Participant Structure:
```
interface Participant {
  id: string;           // Unique identifier
  name: string;         // Display name
  isHost: boolean;      // Has host privileges
}
```


### Store Actions & Logic

#### Queue Management

| Action            | Function              | Logic Description                                                                 |
|-------------------|-----------------------|-----------------------------------------------------------------------------------|
| Add to Queue      | addToQueue(item)      | Appends item to the queue array                                                   |
| Remove from Queue | removeFromQueue(id)   | Removes item from queue by filtering with id                                      |
| Play Item         | playItem(item)        | Removes item from queue, pushes current to history, sets as currentPlaying        |
| Play Next         | playNext()            | Takes first item from queue, pushes current to history, updates currentPlaying    |
| Play Previous     | playPrevious()        | Takes last item from history, pushes current to front of queue, updates currentPlaying |

### Play Next Logic Flow

1. Check if queue has items
2. If currentPlaying exists, add to history (front of array, max 50)
3. Take first item from queue (queue[0])
4. Remove that item from queue (queue.slice(1))
5. Set currentPlaying = nextItem
6. Reset isPlaying = true, currentTime = 0, duration = 0

### Play Previous Logic Flow:

1. Check if history has items
2. If currentPlaying exists, add to front of queue
3. Take first item from history (history[0])
4. Remove that item from history (history.slice(1))
5. Set currentPlaying = previousItem
6. Reset isPlaying = true, currentTime = 0, duration = 0

### Play Item Logic Flow:

1. If currentPlaying exists, add to history (front of array, max 50)
2. Remove the item from queue if present
3. Set currentPlaying = selected item
4. Reset isPlaying = true, currentTime = 0, duration = 0


## Components Documentation

### 1. VideoPlayer

File: src/components/room/VideoPlayer.tsx

Purpose: Main video player responsible for handling both YouTube and local media playback.

#### Key Functions

| Function             | Purpose                          | Called When                                  |
|----------------------|----------------------------------|----------------------------------------------|
| `handlePlayPause()`    | Toggle playback                  | On play/pause button click                   |
| `handleSeekBackward()` | Seek backward by 10 seconds      | On backward button click                     |
| `handleSeekForward()`  | Seek forward by 10 seconds       | On forward button click                      |
| `handleVolumeChange()` | Adjust volume level              | On volume slider change                      |
| `toggleMute()`         | Toggle mute/unmute               | On mute button click                         |
| `handleRateChange()`   | Cycle through playback speeds    | On speed control button click                |
| `handleVideoEvent()`   | Sync video state with store      | On video events (play, pause, timeupdate)    |

#### Video Event Handlers

| Event            | Action                                      |
|------------------|---------------------------------------------|
| onPlay           | setIsPlaying(true)                          |
| onPause          | setIsPlaying(false)                         |
| onTimeUpdate     | setCurrentTime(video.currentTime)           |
| onLoadedMetadata | setDuration(video.duration)                 |
| onEnded          | playNext()                                  |

### Sync Effects (Local video only):

```
// Sync play/pause state
useEffect(() => {
  if (isPlaying) video.play() else video.pause()
}, [isPlaying])

// Sync current time (if difference > 0.5 seconds)
useEffect(() => {
  if (Math.abs(video.currentTime - currentTime) > 0.5) {
    video.currentTime = currentTime
  }
}, [currentTime])

// Sync volume
useEffect(() => {
  video.volume = isMuted ? 0 : volume / 100
}, [volume, isMuted])

// Sync playback rate
useEffect(() => {
  video.playbackRate = playbackRate
}, [playbackRate])
```

### YouTube Player Events:

onEnd → playNext()

### 2. Queue

File: src/components/room/Queue.tsx

Purpose: Displays queued media items and provides management controls.

#### Features

- Displays total queue count in the header
- Each item includes:
  - Media type icon (YouTube in red or local with primary color)
  - Title
  - Added by (user)
  - Position in queue
- Click on an item to play it immediately
- Hover interaction reveals delete/remove button
- Shows empty state message when queue is empty


### 3. AddMedia

File: src/components/room/AddMedia.tsx

Purpose: Allows users to add YouTube videos or local media files to the queue.

#### YouTube Flow

1. User enters URL
2. Extract videoId using regex: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
3. Fetch video title from YouTube oEmbed API
4. Create queue item with type: 'youtube', videoId, title
5. Add to queue via addToQueue()
6. If nothing playing, auto-play via playItem()

#### Local File Flow:

1. User selects file
2. Create blob URL using URL.createObjectURL()
3. Remove file extension for title
4. Create queue item with type: 'local', url, title
5. Add to queue via addToQueue()
6. If nothing playing, auto-play via playItem()

### 4. Chat

File: src/components/room/Chat.tsx

Purpose: Enables real-time messaging between participants.

#### Features

- Message list with automatic scroll to bottom
- Send messages using Enter key or send button
- Each message displays:
  - Username (styled with primary color)
  - Message content (styled with secondary color)
- System-generated welcome message when a user joins the room


### 5. Participants

File: src/components/room/Participants.tsx

Purpose: Displays all participants currently in the room.

#### Features

- Shows total participant count in the header
- Speaking indicator (green pulsing dot)
- Host badge (crown icon)
- Background highlight for active speaker
- Includes 18 dummy participants for demo/testing

#### Status Indicators

| Icon        | Meaning                |
|-------------|-----------------------|
| Crown       | Host                  |
| Headphones  | Regular participant   |
| Mic (green) | Currently speaking    |
| MicOff      | Not speaking          |
| Green dot   | Speaking indicator    |


### 6. LeaveRoomModal

File: src/components/room/LeaveRoomModal.tsx

Purpose: Confirms user intent before leaving a room.

#### Features

- Displays confirmation dialog before leaving
- Provides cancel and confirm options
- On confirmation, redirects user to dashboard


### Persistent Storage

File: src/store/savedRoomsStore.ts

Purpose: Persists room data across sessions for the Rooms page.

- Storage Key: lyrics_library_rooms

#### Data Structure

```
interface SavedRoom {
  id: string;              // Room ID
  name: string;            // Room name
  createdAt: string;       // ISO timestamp
  lastVisited: string;     // ISO timestamp
  isActive: boolean;       // Currently active?
  participantCount?: number; // Number of people in room
  isCreator: boolean;      // User created this room?
}
```

#### Functions

| Function                         | Purpose                                              |
|----------------------------------|------------------------------------------------------|
| getSavedRooms()                  | Retrieve all saved rooms from localStorage           |
| saveRoom(room)                   | Save or update a room (maintains max of 20 rooms)    |
| updateRoomLastVisited(roomId)    | Update the last visited timestamp of a room          |
| removeRoom(roomId)               | Delete a saved room                                  |

### Data Flow Diagrams

#### Adding Media Flow

1. User Action → AddMedia Component
2. Extract YouTube ID OR Create Blob URL
3. Create QueueItem object
4. addToQueue(item) → Updates queue in store
5. Check if currentPlaying is null
6. If null → playItem(item) → Sets as current playing 


#### Play Next Flow:

1. Video Ends OR User clicks Next
2. playNext() action in store
3. Add currentPlaying to history (if exists)
4. Take first item from queue
5. Remove that item from queue
6. Set currentPlaying = nextItem
7. VideoPlayer component re-renders with new content
8. Auto-plays if type is YouTube, or sync effect plays local video


#### Play Previous Flow:
1. User clicks Previous button
2. playPrevious() action in store
3. Add currentPlaying to front of queue (if exists)
4. Take first item from history
5. Remove that item from history
6. Set currentPlaying = previousItem
7. VideoPlayer component re-renders


#### Playback Sync Flow (Local Video):
1. Video event occurs (play/pause/seek)
2. handleVideoEvent() in VideoPlayer
3. Store action called (setIsPlaying/setCurrentTime)
4. Zustand store updates state
5. useEffect hooks in other participants would detect changes
6. (WebSocket would broadcast to sync across users - TODO)


### Key Design Decisions

- Zustand over Context API: Better performance, less boilerplate, built-in persistence  
- Separate stores:
  - roomStore for active session state  
  - savedRoomsStore for persistence  
- History limit: Maximum 50 items to prevent memory issues  
- Auto-play on empty: First added media plays immediately if nothing is active  
- Queue removal on play: Playing an item removes it from queue  
- Sync threshold: 0.5s tolerance to prevent jitter  
- YouTube via oEmbed: Fetches real video metadata for improved UX  

### TODO / Future Improvements

- WebSocket integration for real-time synchronization  
- Host transfer when current host leaves  
- Room persistence even when empty  
- Voice chat using WebRTC  
- Playlist saving functionality  
- Keyboard shortcuts (space, arrows, etc.)  
- Picture-in-picture support  
- Quality selection for YouTube playback  

### Dependencies Used

```json
{
  "zustand": "^4.4.0",
  "react-youtube": "^10.1.0",
  "lucide-react": "^0.263.0"
}