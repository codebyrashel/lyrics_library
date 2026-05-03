import { useEffect, useCallback, useRef } from 'react';
import { wsService } from '@/services/websocket.service';

export const useWebSocket = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const sendMessage = useCallback((type: string, data: any) => {
    if (wsService.isConnected()) {
      wsService.send(type, data);
      return true;
    }
    return false;
  }, []);

  const onMessage = useCallback((type: string, handler: (data: any) => void) => {
    wsService.on(type, handler);
    return () => {
      if (isMounted.current) {
        wsService.off(type, handler);
      }
    };
  }, []);

  const connect = useCallback(() => {
    wsService.connect();
  }, []);

  const disconnect = useCallback(() => {
    wsService.disconnect();
  }, []);

  const isConnected = useCallback(() => {
    return wsService.isConnected();
  }, []);

  return {
    sendMessage,
    onMessage,
    connect,
    disconnect,
    isConnected,
    getStatus: wsService.getStatus.bind(wsService),
  };
};