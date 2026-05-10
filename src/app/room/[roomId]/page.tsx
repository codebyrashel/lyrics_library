'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { VideoPlayer } from '@/components/room/players/VideoPlayer';
import { Chat } from '@/components/room/chat/Chat';
import { Playlist } from '@/components/room/playlist/Playlist';
import { Participants } from '@/components/room/participants/Participants';
import { LeaveRoomModal } from '@/components/room/LeaveRoomModal';
import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';
import { saveRoom, updateRoomLastVisited } from '@/store/savedRoomsStore';
import { wsService } from '@/services/websocket.service';
import { useAuth } from '@/contexts/AuthContext';
import { ShareButton } from '@/components/ui/ShareButton';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const roomName = searchParams.get('name') || `Room ${roomId.slice(0, 8)}`;
  const isHost = searchParams.get('isHost') === 'true';
  const colors = getColors();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const { resetRoom } = useRoomStore();
  const { user } = useAuth();
  
  const hasJoined = useRef(false);

  useEffect(() => {
    console.log('[RoomPage] ========== COMPONENT MOUNT ==========');
    console.log('[RoomPage] Room ID:', roomId);
    console.log('[RoomPage] User:', user?.id, user?.name);
    
    saveRoom({
      id: roomId,
      name: roomName,
      createdAt: new Date().toISOString(),
      lastVisited: new Date().toISOString(),
      isActive: true,
      participantCount: 1,
      isCreator: isHost
    });
    updateRoomLastVisited(roomId);
    
    // Function to connect WebSocket and join room
    const setupWebSocket = async () => {
      if (!user?.id) return;
      
      // Connect WebSocket if not connected
      if (!wsService.isConnected()) {
        console.log('[RoomPage] Connecting WebSocket...');
        wsService.connect(user.id, false);
        
        // Wait for connection
        await new Promise<void>((resolve) => {
          const checkInterval = setInterval(() => {
            if (wsService.isConnected()) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
          
          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            resolve();
          }, 5000);
        });
      }
      
      // Join room
      if (wsService.isConnected() && !hasJoined.current) {
        hasJoined.current = true;
        console.log('[RoomPage] Sending room:join event');
        wsService.joinRoom(roomId, user.id, user.name, false);
      }
    };
    
    setupWebSocket();
    
    return () => {
      console.log('[RoomPage] ========== COMPONENT UNMOUNT ==========');
      if (user?.id && wsService.isConnected() && hasJoined.current) {
        console.log('[RoomPage] Sending room:leave event');
        wsService.leaveRoom(roomId, user.id);
      }
      resetRoom();
      hasJoined.current = false;
    };
  }, [roomId, roomName, isHost, resetRoom, user]);

  const handleLeaveRoom = () => {
    console.log('[RoomPage] Leave room button clicked');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
            {roomName}
          </h1>
<div className="flex items-center gap-2">
  <ShareButton roomId={roomId} variant="outline" size="md" />
  <button
    onClick={() => setShowLeaveModal(true)}
    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-opacity"
    style={{ 
      backgroundColor: colors.status.error,
      color: 'white'
    }}
    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
  >
    <LogOut size={18} />
    <span>Leave Room</span>
  </button>
</div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer />
            <div className="h-96">
              <Playlist roomId={roomId} />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-96">
              <Chat roomId={roomId} />
            </div>
            <Participants roomId={roomId} />
          </div>
        </div>
      </div>

      <LeaveRoomModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeaveRoom}
      />
    </div>
  );
}