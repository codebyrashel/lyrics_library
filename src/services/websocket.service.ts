// WebSocket service for real-time communication
class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Map<string, ((data: any) => void)[]> = new Map();
  private isIntentionalClose = false;
  private pingInterval: NodeJS.Timeout | null = null;

  connect() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('WebSocket: No auth token, skipping connection');
      return;
    }

    if (this.socket && (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)) {
      console.log('WebSocket: Already connecting or connected');
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/api/ws';
    const fullUrl = `${wsUrl}?token=${token}`;
    
    console.log('WebSocket: Connecting to', fullUrl.replace(token, '***'));
    
    try {
      this.socket = new WebSocket(fullUrl);
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket: Connection error:', error);
    }
  }

  private handleOpen() {
    console.log('WebSocket: Connected successfully');
    this.reconnectAttempts = 0;
    this.isIntentionalClose = false;
    
    // Send a ping every 25 seconds to keep connection alive
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send('ping', {});
        console.log('WebSocket: Sent ping');
      }
    }, 25000);
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      
      // Handle pong response
      if (data.type === 'pong') {
        console.log('WebSocket: Received pong');
        return;
      }
      
      // Handle server ping (respond with pong)
      if (data.type === 'ping') {
        this.send('pong', {});
        return;
      }
      
      console.log('WebSocket: Received message type:', data.type);
      const { type, data: messageData } = data;
      
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        handlers.forEach(handler => handler(messageData));
      }
    } catch (error) {
      console.error('WebSocket: Error parsing message:', error);
    }
  }

  private handleClose(event: CloseEvent) {
    console.log(`WebSocket: Disconnected - Code: ${event.code}, Reason: ${event.reason}`);
    
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (!this.isIntentionalClose && event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  private handleError(error: Event) {
    console.error('WebSocket: Error occurred');
    if (this.socket) {
      console.log('WebSocket: ReadyState:', this.socket.readyState);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.isIntentionalClose) {
      this.reconnectAttempts++;
      console.log(`WebSocket: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('WebSocket: Max reconnect attempts reached');
    }
  }

  on(messageType: string, handler: (data: any) => void) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }

  off(messageType: string, handler: (data: any) => void) {
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
    console.log('WebSocket: Intentional disconnect');
    this.isIntentionalClose = true;
    
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (this.socket) {
      this.socket.close(1000, 'Normal closure');
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();