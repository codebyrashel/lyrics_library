'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { VideoPlayer } from '@/components/room/VideoPlayer';
import { Chat } from '@/components/room/Chat';
import { Queue } from '@/components/room/Queue';
import { Participants } from '@/components/room/Participants';
import { LeaveRoomModal } from '@/components/room/LeaveRoomModal';
import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const roomName = searchParams.get('name') || `Room ${roomId.slice(0, 8)}`;
  const colors = getColors();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const { resetRoom } = useRoomStore();

  useEffect(() => {
    return () => {
      resetRoom();
    };
  }, [resetRoom]);

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
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
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
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer />
            <div className="h-96">
              <Queue />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-96">
              <Chat />
            </div>
            <div className="flex-1" style={{ height: 'calc(100vh - 200px)' }}>
              <Participants />
            </div>
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