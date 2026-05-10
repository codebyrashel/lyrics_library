// WebSocket service for real-time communication
type MessageHandler = (data: any) => void;

interface RoomJoinData {
  roomId: string;
  userId: string;
  name: string;
  isGuest?: boolean;
  guestName?: string;
}

interface RoomLeaveData {
  roomId: string;
  userId: string;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 3000;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private isIntentionalClose = false;
  private pingInterval: NodeJS.Timeout | null = null;
  private pongTimeout: NodeJS.Timeout | null = null;
  private connectionStatus: 'connecting' | 'connected' | 'disconnected' = 'disconnected';
  private currentRoomId: string | null = null;
  private userId: string | null = null;
  private isGuestMode: boolean = false;

  // Connect to WebSocket server (supports both authenticated and guest users)
  connect(userId?: string, isGuest: boolean = false) {
    console.log(`[WebSocket] connect() called with userId=${userId}, isGuest=${isGuest}`);
    this.isGuestMode = isGuest;
    
    // For guests, we don't need a token
    if (!isGuest) {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.log('[WebSocket] No auth token, skipping connection');
        return;
      }
    }

    if (userId) {
      this.userId = userId;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected');
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
      console.log('[WebSocket] Connection in progress');
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/api/ws';
    
    // Build URL with token or guest ID
    let fullUrl = wsUrl;
    const token = localStorage.getItem('auth_token');
    
    if (token && !isGuest) {
      fullUrl = `${wsUrl}?token=${token}`;
      console.log('[WebSocket] Connecting as authenticated user');
    } else if (userId && isGuest) {
      fullUrl = `${wsUrl}?guestId=${userId}`;
      console.log('[WebSocket] Connecting as guest with ID:', userId);
    } else {
      console.log('[WebSocket] No auth token or guest ID, skipping connection');
      return;
    }

    this.connectionStatus = 'connecting';
    console.log('[WebSocket] Connecting to', fullUrl);

    try {
      this.socket = new WebSocket(fullUrl);

      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.connectionStatus = 'disconnected';
    }
  }

  private handleOpen() {
    console.log('[WebSocket] ✅ Connected successfully');
    this.reconnectAttempts = 0;
    this.isIntentionalClose = false;
    this.connectionStatus = 'connected';
    this.startPingInterval();
    
    // Re-join room if we were in one before disconnect
    if (this.currentRoomId && this.userId) {
      console.log('[WebSocket] Re-joining room', this.currentRoomId);
      this.joinRoom(this.currentRoomId, this.userId, 'User', this.isGuestMode);
    }
  }

private startPingInterval() {
  if (this.pingInterval) {
    clearInterval(this.pingInterval);
  }

  // Send ping every 50 seconds (increased from 25)
  this.pingInterval = setInterval(() => {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.send('ping', {});

      if (this.pongTimeout) {
        clearTimeout(this.pongTimeout);
      }
      // Wait 10 seconds for pong response (increased from 5)
      this.pongTimeout = setTimeout(() => {
        console.log('[WebSocket] Pong timeout, reconnecting');
        this.reconnect();
      }, 10000);
    }
  }, 50000);
}

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      
      // Log ALL messages for debugging
      console.log('[WebSocket] 📨 Received message:', data);

      // Handle pong response
      if (data.type === 'pong') {
        console.log('[WebSocket] Received pong');
        if (this.pongTimeout) {
          clearTimeout(this.pongTimeout);
          this.pongTimeout = null;
        }
        return;
      }

      // Handle server ping - respond with pong
      if (data.type === 'ping') {
        console.log('[WebSocket] Received ping, sending pong');
        this.send('pong', {});
        return;
      }

      // Extract message type and data
      let messageType = data.type;
      let messageData = data.data || data;
      
      // Handle room:join and room:leave events from server
      if (messageType === 'room:join') {
        console.log('[WebSocket] Server confirmed room join:', messageData);
        // Convert to participant_joined event for handlers
        messageType = 'participant_joined';
        messageData = {
          userId: messageData.userId,
          name: messageData.name,
          role: messageData.role,
          isGuest: messageData.isGuest,
          guestName: messageData.guestName,
        };
      }
      
      if (messageType === 'room:leave') {
        console.log('[WebSocket] Server confirmed room leave:', messageData);
        // Convert to participant_left event for handlers
        messageType = 'participant_left';
        messageData = {
          userId: messageData.userId,
        };
      }
      
      // Log important events
      if (messageType === 'participant_joined') {
        console.log('[WebSocket] 🟢 PARTICIPANT_JOINED event:', messageData);
      }
      if (messageType === 'participant_left') {
        console.log('[WebSocket] 🔴 PARTICIPANT_LEFT event:', messageData);
      }

      // Dispatch to registered handlers
      const handlers = this.messageHandlers.get(messageType);
      if (handlers && handlers.length > 0) {
        console.log(`[WebSocket] Dispatching to ${handlers.length} handlers for type: ${messageType}`);
        handlers.forEach(handler => handler(messageData));
      } else {
        console.log(`[WebSocket] No handlers registered for type: ${messageType}`);
      }
    } catch (error) {
      console.error('[WebSocket] Message parsing error:', error);
    }
  }

  private handleClose(event: CloseEvent) {
    console.log('[WebSocket] Disconnected', event.code, event.reason);
    this.connectionStatus = 'disconnected';
    this.currentRoomId = null;
    this.stopPingInterval();

    if (!this.isIntentionalClose && event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  private handleError(error: Event) {
    console.error('[WebSocket] Error:', error);
    this.connectionStatus = 'disconnected';
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.isIntentionalClose) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
      console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(this.userId || undefined, this.isGuestMode), delay);
    }
  }

  private reconnect() {
    this.disconnect();
    setTimeout(() => this.connect(this.userId || undefined, this.isGuestMode), 1000);
  }

  on(messageType: string, handler: MessageHandler) {
    console.log(`[WebSocket] Registering handler for: ${messageType}`);
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }

  off(messageType: string, handler: MessageHandler) {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
        console.log(`[WebSocket] Removed handler for: ${messageType}`);
      }
    }
  }

  send(type: string, data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, data });
      console.log(`[WebSocket] 📤 Sending message:`, { type, data });
      this.socket.send(message);
    } else {
      console.warn(`[WebSocket] Cannot send ${type}, not connected. State:`, this.socket?.readyState);
    }
  }

  joinRoom(roomId: string, userId: string, name: string, isGuest: boolean = false, guestName?: string) {
    console.log(`[WebSocket] Joining room: ${roomId} as ${name} (isGuest: ${isGuest})`);
    this.currentRoomId = roomId;
    this.userId = userId;
    this.isGuestMode = isGuest;
    
    const joinData: any = {
      roomId,
      userId,
      name,
      isGuest,
    };
    
    // Only add guestName if it's provided and isGuest is true
    if (isGuest && guestName) {
      joinData.guestName = guestName;
    }
    
    this.send('room:join', joinData);
  }

  leaveRoom(roomId: string, userId: string) {
    console.log(`[WebSocket] Leaving room: ${roomId}`);
    this.send('room:leave', {
      roomId,
      userId,
    });
    if (this.currentRoomId === roomId) {
      this.currentRoomId = null;
    }
  }

  disconnect() {
    console.log('[WebSocket] Intentional disconnect');
    if (this.currentRoomId && this.userId) {
      this.leaveRoom(this.currentRoomId, this.userId);
    }
    
    this.isIntentionalClose = true;
    this.stopPingInterval();
    this.currentRoomId = null;

    if (this.socket) {
      this.socket.close(1000, 'Normal closure');
      this.socket = null;
    }
    this.connectionStatus = 'disconnected';
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  getStatus(): string {
    return this.connectionStatus;
  }

  getCurrentRoom(): string | null {
    return this.currentRoomId;
  }
}

export const wsService = new WebSocketService();