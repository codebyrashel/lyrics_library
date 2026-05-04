'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
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
    
    return () => {
      resetRoom();
    };
  }, [roomId, roomName, isHost, resetRoom]);

  const handleLeaveRoom = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
            {roomName}
          </h1>
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

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Column - Video Player and Playlist */}
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer />
            <div className="h-96">
              <Playlist roomId={roomId} />
            </div>
          </div>
          
          {/* Right Column - Chat and Participants */}
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