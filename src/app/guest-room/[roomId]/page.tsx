'use client';

import { useState, useEffect, useRef } from 'react';
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
import { getGuestAvatarColor, getGuestInitial } from '@/utils/guestNameGenerator';
import { wsService } from '@/services/websocket.service';
import { ShareButton } from '@/components/ui/ShareButton';

export default function GuestRoomPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const roomName = searchParams.get('name') || `Room ${roomId.slice(0, 8)}`;
  const isHost = searchParams.get('isHost') === 'true';
  
  const colors = getColors();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestAvatarColor, setGuestAvatarColor] = useState('');
  const [isClient, setIsClient] = useState(false);
  const { resetRoom } = useRoomStore();
  
  // Add refs to prevent duplicate events
  const hasJoined = useRef(false);
  const hasConnected = useRef(false);

  // Initialize client-side only data
  useEffect(() => {
    console.log('[GuestRoomPage] ========== COMPONENT MOUNT ==========');
    console.log('[GuestRoomPage] Room ID:', roomId);
    console.log('[GuestRoomPage] Room Name:', roomName);
    console.log('[GuestRoomPage] Is Host:', isHost);
    
    setIsClient(true);
    
    const guestStatus = guestService.isGuest();
    setIsGuest(guestStatus);
    console.log('[GuestRoomPage] Is Guest:', guestStatus);
    
    if (guestStatus) {
      // First, try to get the guest name from the URL or localStorage
      const urlGuestName = searchParams.get('guestName');
      console.log('[GuestRoomPage] URL guestName:', urlGuestName);
      
      let finalGuestName = '';
      if (urlGuestName) {
        finalGuestName = urlGuestName;
        setGuestName(urlGuestName);
        setGuestAvatarColor(getGuestAvatarColor(urlGuestName));
        guestService.setGuestName(urlGuestName);
        console.log('[GuestRoomPage] Using guest name from URL:', finalGuestName);
      } else {
        const name = guestService.getGuestName();
        finalGuestName = name;
        setGuestName(name);
        setGuestAvatarColor(getGuestAvatarColor(name));
        console.log('[GuestRoomPage] Using guest name from localStorage:', finalGuestName);
      }
      
      guestService.saveGuestRoom(roomId, roomName, isHost);
      
      // Connect WebSocket and send join event - only once
      if (!hasConnected.current) {
        hasConnected.current = true;
        const guestId = guestService.getGuestId();
        console.log('[GuestRoomPage] Guest ID:', guestId);
        console.log('[GuestRoomPage] Connecting WebSocket as guest...');
        wsService.connect(guestId, true);
        
        // Small delay to ensure WebSocket is connected
        setTimeout(() => {
          if (wsService.isConnected() && !hasJoined.current) {
            hasJoined.current = true;
            console.log('[GuestRoomPage] WebSocket connected, sending room:join event');
            wsService.joinRoom(roomId, guestId, finalGuestName, true, finalGuestName);
          } else if (!hasJoined.current) {
            console.log('[GuestRoomPage] WebSocket not connected yet, will retry in 1 second');
            setTimeout(() => {
              if (wsService.isConnected() && !hasJoined.current) {
                hasJoined.current = true;
                console.log('[GuestRoomPage] WebSocket now connected, sending room:join event');
                wsService.joinRoom(roomId, guestId, finalGuestName, true, finalGuestName);
              } else if (!hasJoined.current) {
                console.error('[GuestRoomPage] WebSocket failed to connect');
              }
            }, 1000);
          }
        }, 500);
      }
      
      const timer = setTimeout(() => setShowUpsell(true), 30000);
      return () => {
        console.log('[GuestRoomPage] ========== COMPONENT UNMOUNT ==========');
        clearTimeout(timer);
        if (wsService.isConnected() && hasJoined.current) {
          console.log('[GuestRoomPage] Sending room:leave event for guest');
          wsService.leaveRoom(roomId, guestService.getGuestId());
        }
        // Reset refs
        hasJoined.current = false;
        hasConnected.current = false;
      };
    }
    
    return () => {
      console.log('[GuestRoomPage] ========== COMPONENT UNMOUNT (non-guest) ==========');
      resetRoom();
    };
  }, [roomId, roomName, isHost, resetRoom, searchParams]);

  const handleLeaveRoom = () => {
    console.log('[GuestRoomPage] Leave room button clicked');
    router.push('/');
  };

  const showGuestInfo = isClient && isGuest && guestName;

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              {roomName}
            </h1>
            {showGuestInfo && (
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white"
                  style={{ backgroundColor: guestAvatarColor }}
                >
                  {getGuestInitial(guestName)}
                </div>
                <span className="text-xs font-medium" style={{ color: colors.text.primary }}>
                  {guestName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
                  Guest
                </span>
              </div>
            )}
          </div>
<div className="flex items-center gap-2">
  <ShareButton roomId={roomId} variant="outline" size="md" />
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