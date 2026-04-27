'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { RoomProvider } from '@/contexts/RoomContext';
import { VideoPlayer } from '@/components/room/VideoPlayer';
import { Chat } from '@/components/room/Chat';
import { Queue } from '@/components/room/Queue';
import { Participants } from '@/components/room/Participants';
import { LeaveRoomModal } from '@/components/room/LeaveRoomModal';
import { getColors } from '@/store/colorStore';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const colors = getColors();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const handleLeaveRoom = () => {
    router.push('/dashboard');
  };

  return (
    <RoomProvider roomId={roomId}>
      <div className="min-h-screen p-4" style={{ backgroundColor: colors.background }}>
        <div className="max-w-7xl mx-auto">
          {/* Room Header with Leave Button */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Room: {roomId}
            </h1>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
              style={{ 
                backgroundColor: colors.status.error,
                color: 'white'
              }}
            >
              <LogOut size={18} />
              <span>Leave Room</span>
            </button>
          </div>

          {/* Main Grid - Swapped Queue and Participants positions */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Left Column - Video Player */}
            <div className="lg:col-span-2 space-y-4">
              <VideoPlayer />
              {/* Queue moved here (was in right column) */}
              <div className="h-96">
                <Queue />
              </div>
            </div>

            {/* Right Column - Chat & Participants */}
            <div className="space-y-4">
              <div className="h-96">
                <Chat />
              </div>
              {/* Participants moved here (was in left column) - now full height */}
              <div className="flex-1" style={{ height: 'calc(100vh - 200px)' }}>
                <Participants />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Room Modal */}
      <LeaveRoomModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeaveRoom}
      />
    </RoomProvider>
  );
}