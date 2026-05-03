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

  connect() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('WebSocket: No auth token, skipping connection');
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket: Already connected');
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
      console.log('WebSocket: Already connecting');
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/api/ws';
    const fullUrl = `${wsUrl}?token=${token}`;

    console.log('WebSocket: Connecting to', fullUrl.replace(token, '***'));
    this.connectionStatus = 'connecting';

    try {
      this.socket = new WebSocket(fullUrl);

      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket: Connection error:', error);
      this.connectionStatus = 'disconnected';
    }
  }

  private handleOpen() {
    console.log('WebSocket: Connected successfully');
    this.reconnectAttempts = 0;
    this.isIntentionalClose = false;
    this.connectionStatus = 'connected';

    // Start ping interval to keep connection alive
    this.startPingInterval();
  }

  private startPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    // Send ping every 25 seconds
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send('ping', {});
        console.log('WebSocket: Sent ping');

        // Set timeout for pong response
        if (this.pongTimeout) {
          clearTimeout(this.pongTimeout);
        }
        this.pongTimeout = setTimeout(() => {
          console.log('WebSocket: No pong received, reconnecting...');
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
        console.log('WebSocket: Received pong');
        if (this.pongTimeout) {
          clearTimeout(this.pongTimeout);
          this.pongTimeout = null;
        }
        return;
      }

      // Handle server ping (respond with pong)
      if (data.type === 'ping') {
        this.send('pong', {});
        return;
      }

      console.log('WebSocket: Received message type:', data.type);

      const handlers = this.messageHandlers.get(data.type);
      if (handlers && handlers.length > 0) {
        handlers.forEach(handler => handler(data.data));
      }
    } catch (error) {
      console.error('WebSocket: Error parsing message:', error);
    }
  }

  private handleClose(event: CloseEvent) {
    console.log(`WebSocket: Disconnected - Code: ${event.code}, Reason: ${event.reason}`);
    this.connectionStatus = 'disconnected';

    this.stopPingInterval();

    if (!this.isIntentionalClose && event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  private handleError(error: Event) {
    console.error('WebSocket: Error occurred');
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
      console.log(`WebSocket: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('WebSocket: Max reconnect attempts reached');
    }
  }

  private reconnect() {
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }

  on(messageType: string, handler: MessageHandler) {
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
      }
    }
  }

  send(type: string, data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, data }));
      console.log('WebSocket: Sent message type:', type);
    } else {
      console.log('WebSocket: Not connected, readyState:', this.socket?.readyState);
    }
  }

  disconnect() {
    console.log('🔌 WebSocket: Intentional disconnect');
    this.isIntentionalClose = true;
    this.stopPingInterval();

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
}

export const wsService = new WebSocketService();