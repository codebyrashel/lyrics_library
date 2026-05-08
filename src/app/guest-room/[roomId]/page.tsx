'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { VideoPlayer } from '@/components/room/players/VideoPlayer';
import { Playlist } from '@/components/room/playlist/Playlist';
import { Participants } from '@/components/room/participants/Participants';
import { LeaveRoomModal } from '@/components/room/LeaveRoomModal';
import { UpsellBanner } from '@/components/room/UpsellBanner';
import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';
import { guestService } from '@/services/guest.service';
import { ChatBlocker } from '@/components/room/ChatBlocker';

export default function GuestRoomPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const roomName = searchParams.get('name') || `Room ${roomId.slice(0, 8)}`;
  const isHost = searchParams.get('isHost') === 'true';
  const isGuest = guestService.isGuest();
  
  const colors = getColors();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const { resetRoom } = useRoomStore();

  useEffect(() => {
    guestService.saveGuestRoom(roomId, roomName, isHost);
    
    if (isGuest) {
      const timer = setTimeout(() => setShowUpsell(true), 30000);
      return () => clearTimeout(timer);
    }
    
    return () => {
      resetRoom();
    };
  }, [roomId, roomName, isHost, isGuest, resetRoom]);

  const handleLeaveRoom = () => {
    router.push('/');
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              {roomName}
            </h1>
            {isGuest && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
                  Guest Mode
                </span>
                <span className="text-xs" style={{ color: colors.text.muted }}>
                  Chat locked • Max 3 participants
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: colors.status.error,
              color: 'white'
            }}
          >
            <LogOut size={18} />
            <span>Leave Room</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer />
            <div className="h-96">
              <Playlist roomId={roomId} />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-96 relative">
              <div 
                className="absolute inset-0 rounded-xl opacity-50 pointer-events-none"
                style={{ backgroundColor: colors.surface }}
              />
              <ChatBlocker roomId={roomId} />
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

      {/* Upsell Banner - rendered at root level of component */}
      {showUpsell && isGuest && (
        <UpsellBanner
          roomId={roomId}
          type="watch"
          onClose={() => setShowUpsell(false)}
        />
      )}
    </div>
  );
}