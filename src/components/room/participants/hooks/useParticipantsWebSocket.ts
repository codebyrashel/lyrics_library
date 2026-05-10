import { useEffect } from 'react';
import { wsService } from '@/services/websocket.service';
import { Participant } from '@/types/participant';

interface ParticipantJoinedData {
  userId?: string;
  id?: string;
  name?: string;
  username?: string;
  avatar?: string;
  role?: string;
  isGuest?: boolean;
  guestName?: string;
  joinedAt?: string;
}

interface ParticipantLeftData {
  userId?: string;
  id?: string;
  leftAt?: string;
}

interface ParticipantUpdatedData {
  userId: string;
  isSpeaking?: boolean;
  isTyping?: boolean;
}

interface HostChangedData {
  newHostId: string;
  oldHostId?: string;
}

export const useParticipantsWebSocket = (
  roomId: string,
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>
) => {
  useEffect(() => {
    console.log(`[useParticipantsWebSocket] ========== SETUP START ==========`);
    console.log(`[useParticipantsWebSocket] Room ID: ${roomId}`);
    console.log(`[useParticipantsWebSocket] WebSocket connected: ${wsService.isConnected()}`);
    
    // Handle when a new participant joins the room
    const handleParticipantJoined = (data: ParticipantJoinedData) => {
      console.log(`[useParticipantsWebSocket] 🔵🔵🔵 PARTICIPANT_JOINED EVENT RECEIVED 🔵🔵🔵`);
      console.log(`[useParticipantsWebSocket] Full data:`, JSON.stringify(data, null, 2));
      
      // Extract data with safe defaults
      const userId = data.userId || data.id;
      const isGuest = data.isGuest === true;
      const name = data.name || data.guestName || (isGuest ? 'Guest' : 'User');
      const guestName = data.guestName || (isGuest ? name : undefined);
      const role = data.role || 'participant';
      
      console.log(`[useParticipantsWebSocket] Extracted - userId: ${userId}, name: ${name}, isGuest: ${isGuest}, guestName: ${guestName}, role: ${role}`);
      
      if (!userId) {
        console.warn('[useParticipantsWebSocket] Missing userId, skipping participant join');
        return;
      }
      
      setParticipants(prev => {
        console.log(`[useParticipantsWebSocket] Current participants count: ${prev.length}`);
        console.log(`[useParticipantsWebSocket] Current participants:`, prev.map(p => ({ id: p.id, name: p.name })));
        
        // Check if participant already exists
        if (prev.some(p => p.id === userId)) {
          console.log(`[useParticipantsWebSocket] ⚠️ Participant ${userId} already exists, skipping`);
          return prev;
        }
        
        // Generate username
        let username: string;
        if (data.username && data.username !== '') {
          username = data.username;
        } else if (isGuest) {
          const shortId = userId.slice(0, 8);
          username = `guest_${shortId}`;
        } else {
          username = String(name).toLowerCase().replace(/\s/g, '_');
        }
        
        const newParticipant: Participant = {
          id: userId,
          name: name,
          username: username,
          isHost: role === 'host',
          isSpeaking: false,
          isTyping: false,
          avatar: data.avatar,
          isGuest: isGuest,
          guestName: guestName,
          role: role,
          joinedAt: data.joinedAt || new Date().toISOString(),
        };
        
        console.log(`[useParticipantsWebSocket] ✅ Adding new participant:`, newParticipant);
        console.log(`[useParticipantsWebSocket] New total count: ${prev.length + 1}`);
        return [...prev, newParticipant];
      });
    };

    // Handle when a participant leaves the room
    const handleParticipantLeft = (data: ParticipantLeftData) => {
      console.log(`[useParticipantsWebSocket] 🔴🔴🔴 PARTICIPANT_LEFT EVENT RECEIVED 🔴🔴🔴`);
      console.log(`[useParticipantsWebSocket] Full data:`, JSON.stringify(data, null, 2));
      
      const userId = data.userId || data.id;
      
      if (!userId) {
        console.warn('[useParticipantsWebSocket] Missing userId, skipping participant leave');
        return;
      }
      
      setParticipants(prev => {
        console.log(`[useParticipantsWebSocket] Current participants count: ${prev.length}`);
        const removed = prev.find(p => p.id === userId);
        if (removed) {
          console.log(`[useParticipantsWebSocket] ✅ Removing participant: ${removed.name} (${removed.id})`);
        } else {
          console.log(`[useParticipantsWebSocket] ⚠️ Participant ${userId} not found in list`);
        }
        return prev.filter(p => p.id !== userId);
      });
    };

    // Handle participant status updates
    const handleParticipantUpdated = (data: ParticipantUpdatedData) => {
      console.log(`[useParticipantsWebSocket] 📝 PARTICIPANT_UPDATED:`, data);
      setParticipants(prev => 
        prev.map(p => {
          if (p.id === data.userId) {
            return {
              ...p,
              isSpeaking: data.isSpeaking !== undefined ? data.isSpeaking : p.isSpeaking,
              isTyping: data.isTyping !== undefined ? data.isTyping : p.isTyping,
            };
          }
          return p;
        })
      );
    };

    // Handle host change
    const handleHostChanged = (data: HostChangedData) => {
      console.log(`[useParticipantsWebSocket] 👑 HOST_CHANGED: ${data.newHostId}`);
      setParticipants(prev => 
        prev.map(p => ({
          ...p,
          isHost: p.id === data.newHostId,
        }))
      );
    };

    // Handle nested participant data from room events
    const handleRoomParticipantJoined = (data: any) => {
      console.log(`[useParticipantsWebSocket] 🔵 ROOM:PARTICIPANT_JOINED event received`);
      console.log(`[useParticipantsWebSocket] Data:`, JSON.stringify(data, null, 2));
      if (data.user && data.user.id) {
        handleParticipantJoined({
          userId: data.user.id,
          name: data.user.name,
          username: data.user.username,
          avatar: data.user.avatar,
          role: data.user.role,
          isGuest: data.user.isGuest,
          guestName: data.user.guestName,
        });
      }
    };

    // Generic handler to log all messages
    const logAllMessages = (data: any) => {
      console.log(`[useParticipantsWebSocket] 📨 Any message received:`, data);
    };

    // Register WebSocket event handlers
    console.log('[useParticipantsWebSocket] Registering event handlers...');
    
    wsService.on('participant_joined', handleParticipantJoined);
    wsService.on('participant_left', handleParticipantLeft);
    wsService.on('participant_updated', handleParticipantUpdated);
    wsService.on('host_changed', handleHostChanged);
    wsService.on('room:participant_joined', handleRoomParticipantJoined);
    
    // Also listen for 'room' events that might contain participant info
    const handleRoomEvent = (data: any) => {
      console.log(`[useParticipantsWebSocket] 🏠 ROOM event received:`, data);
      if (data.type === 'participant_joined') {
        console.log('[useParticipantsWebSocket] Found participant_joined inside room event');
        handleParticipantJoined(data);
      } else if (data.type === 'participant_left') {
        console.log('[useParticipantsWebSocket] Found participant_left inside room event');
        handleParticipantLeft(data);
      }
    };

    wsService.on('room', handleRoomEvent);

    // Log all messages for debugging
    wsService.on('*', logAllMessages);

    console.log('[useParticipantsWebSocket] ========== SETUP COMPLETE ==========');
    console.log('[useParticipantsWebSocket] Registered handlers for: participant_joined, participant_left, participant_updated, host_changed, room, room:participant_joined');

    return () => {
      console.log('[useParticipantsWebSocket] ========== CLEANUP ==========');
      wsService.off('participant_joined', handleParticipantJoined);
      wsService.off('participant_left', handleParticipantLeft);
      wsService.off('participant_updated', handleParticipantUpdated);
      wsService.off('host_changed', handleHostChanged);
      wsService.off('room:participant_joined', handleRoomParticipantJoined);
      wsService.off('room', handleRoomEvent);
      wsService.off('*', logAllMessages);
    };
  }, [roomId, setParticipants]);
};