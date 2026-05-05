// WebSocket service for real-time communication
type MessageHandler = (data: any) => void;

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

  // Connect to WebSocket server
  connect() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/api/ws';
    const fullUrl = `${wsUrl}?token=${token}`;

    this.connectionStatus = 'connecting';

    try {
      this.socket = new WebSocket(fullUrl);

      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.connectionStatus = 'disconnected';
    }
  }

  private handleOpen() {
    this.reconnectAttempts = 0;
    this.isIntentionalClose = false;
    this.connectionStatus = 'connected';
    this.startPingInterval();
  }

  private startPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    // Send ping every 25 seconds to keep connection alive
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send('ping', {});

        if (this.pongTimeout) {
          clearTimeout(this.pongTimeout);
        }
        // Wait 5 seconds for pong response
        this.pongTimeout = setTimeout(() => {
          this.reconnect();
        }, 5000);
      }
    }, 25000);
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);

      // Handle pong response
      if (data.type === 'pong') {
        if (this.pongTimeout) {
          clearTimeout(this.pongTimeout);
          this.pongTimeout = null;
        }
        return;
      }

      // Handle server ping - respond with pong
      if (data.type === 'ping') {
        this.send('pong', {});
        return;
      }

      // Dispatch to registered handlers
      const messageType = data.type;
      const messageData = data.data || data;
      const handlers = this.messageHandlers.get(messageType);

      if (handlers && handlers.length > 0) {
        handlers.forEach(handler => handler(messageData));
      }
    } catch (error) {
      console.error('WebSocket message parsing error:', error);
    }
  }

  private handleClose(event: CloseEvent) {
    this.connectionStatus = 'disconnected';
    this.stopPingInterval();

    // Reconnect if not intentional and not a normal closure
    if (!this.isIntentionalClose && event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  private handleError(error: Event) {
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
      setTimeout(() => this.connect(), delay);
    }
  }

  private reconnect() {
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }

  // Register a handler for specific message type
  on(messageType: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }

  // Remove a handler for specific message type
  off(messageType: string, handler: MessageHandler) {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Send a message through WebSocket
  send(type: string, data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, data });
      this.socket.send(message);
    }
  }

  // Disconnect WebSocket intentionally
  disconnect() {
    this.isIntentionalClose = true;
    this.stopPingInterval();

    if (this.socket) {
      this.socket.close(1000, 'Normal closure');
      this.socket = null;
    }
    this.connectionStatus = 'disconnected';
  }

  // Check if WebSocket is connected
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  // Get current connection status
  getStatus(): string {
    return this.connectionStatus;
  }
}

export const wsService = new WebSocketService();