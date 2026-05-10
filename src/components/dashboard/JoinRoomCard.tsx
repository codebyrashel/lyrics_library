'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, DoorOpen } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { wsService } from '@/services/websocket.service';

interface JoinRoomCardProps {
  onJoinRoom?: (roomCode: string) => void;
  isJoining?: boolean;
}

export const JoinRoomCard = ({ onJoinRoom, isJoining: externalIsJoining }: JoinRoomCardProps) => {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [internalIsJoining, setInternalIsJoining] = useState(false);
  const colors = getColors();

  const isJoining = externalIsJoining !== undefined ? externalIsJoining : internalIsJoining;

  const validateRoomCode = (code: string) => {
    if (!code.trim()) {
      setError('Room code is required');
      return false;
    }
    if (code.trim().length < 4) {
      setError('Room code must be at least 4 characters');
      return false;
    }
    setError('');
    return true;
  };

  const joinRoom = async (roomId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const guestId = localStorage.getItem('guest_session_id');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (guestId) {
        headers['X-Guest-ID'] = guestId;
      }

      const encodedRoomId = encodeURIComponent(roomId);
      const url = `http://localhost:8080/api/rooms/${encodedRoomId}/join`;
      console.debug('[JoinRoomCard] Joining room', { url, roomId, headers });
      const response = await fetch(url, {
        method: 'POST',
        headers,
      });

      const responseText = await response.text();
      console.debug('[JoinRoomCard] Join room response', { status: response.status, contentType: response.headers.get('content-type'), text: responseText });
      let data: Record<string, unknown> = { success: false, message: 'Unknown error' };
      try {
        const parsed = responseText ? JSON.parse(responseText) : data;
        if (parsed && typeof parsed === 'object') {
          data = parsed as Record<string, unknown>;
        }
      } catch (parseError) {
        console.error('[JoinRoomCard] Failed to parse join response JSON', parseError, responseText);
        data.message = responseText;
      }

      const dataSuccess = data.success === true;
      const dataMessage = typeof data.message === 'string' ? data.message : 'Failed to join room';
      if (!response.ok || !dataSuccess) {
        setError(`${dataMessage} (${response.status})`);
        return;
      }

      const roomHeaders: HeadersInit = {};
      if (token) {
        roomHeaders['Authorization'] = `Bearer ${token}`;
      } else if (guestId) {
        roomHeaders['X-Guest-ID'] = guestId;
      }

      const roomUrl = `http://localhost:8080/api/rooms/${encodedRoomId}`;
      console.debug('[JoinRoomCard] Fetching room details', { roomUrl, roomHeaders });
      const roomResponse = await fetch(roomUrl, {
        headers: roomHeaders,
      });
      const roomText = await roomResponse.text();
      console.debug('[JoinRoomCard] Room details response', { status: roomResponse.status, contentType: roomResponse.headers.get('content-type'), text: roomText });
      let roomData: Record<string, unknown> = { success: false, message: 'Unknown room response' };
      try {
        const parsed = roomText ? JSON.parse(roomText) : roomData;
        if (parsed && typeof parsed === 'object') {
          roomData = parsed as Record<string, unknown>;
        }
      } catch (parseError) {
        console.error('[JoinRoomCard] Failed to parse room response JSON', parseError, roomText);
        roomData.message = roomText;
      }

      const roomSuccess = roomData.success === true;
      const roomMessage = typeof roomData.message === 'string' ? roomData.message : `Failed to fetch room details (${roomResponse.status})`;
      if (!roomResponse.ok || !roomSuccess) {
        setError(roomMessage);
        return;
      }

      const roomInfo = roomData.room as Record<string, unknown> | undefined;
      const roomName = typeof roomInfo?.name === 'string' ? roomInfo.name : 'Room';
      const isGuest = data.isGuest === true;
      const guestName = typeof data.guestName === 'string' ? data.guestName : undefined;

      wsService.send('room:join', {
        roomId,
        userId: localStorage.getItem('user_id'),
        name: roomName,
      });

      const roomPath = isGuest ? `/guest-room/${roomId}` : `/room/${roomId}`;
      const query = `?name=${encodeURIComponent(roomName)}` + (isGuest && guestName ? `&guestName=${encodeURIComponent(guestName)}` : '');
      router.push(`${roomPath}${query}`);
    } catch (err) {
      console.error('Join room error:', err);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setInternalIsJoining(false);
    }
  };

  const handleSubmit = async () => {
    const cleaned = roomCode.trim().toLowerCase();
    if (!validateRoomCode(cleaned)) return;

    setInternalIsJoining(true);
    setError('');

    if (onJoinRoom) {
      // If external handler is provided, use it
      onJoinRoom(cleaned);
      setInternalIsJoining(false);
    } else {
      // Otherwise use the internal join logic
      await joinRoom(cleaned);
    }
  };

  return (
    <div
      className="p-6 rounded-2xl backdrop-blur-md transition-all hover:scale-[1.01]"
      style={{
        backgroundColor: `${colors.surface}cc`,
        border: `1px solid ${colors.text.muted}20`,
        boxShadow: `0 10px 30px rgba(0,0,0,0.15)`
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: `${colors.primary}15` }}
        >
          <DoorOpen size={20} style={{ color: colors.primary }} />
        </div>

        <div>
          <h3 className="font-semibold text-base" style={{ color: colors.text.primary }}>
            Join a Room
          </h3>
          <p className="text-sm mt-0.5" style={{ color: colors.text.muted }}>
            Enter a room code to connect with others
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. chill-vibes-abc"
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value.toLowerCase());
              if (error) validateRoomCode(e.target.value);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full px-4 py-3 rounded-xl transition-all outline-none"
            style={{
              backgroundColor: colors.background,
              border: error
                ? `1px solid ${colors.status.error}`
                : `1px solid ${colors.text.muted}30`,
              color: colors.text.primary
            }}
          />

          {/* subtle glow on focus */}
          <div className="absolute inset-0 rounded-xl pointer-events-none focus-within:ring-2"
               style={{ boxShadow: `0 0 0 2px transparent` }} />
        </div>

        {error && (
          <p className="text-xs pl-1" style={{ color: colors.status.error }}>
            {error}
          </p>
        )}
      </div>

      {/* Button */}
      <div className="mt-4">
        <Button
          variant="outline"
          onClick={handleSubmit}
          disabled={isJoining || !roomCode.trim()}
          className="w-full py-2.5 rounded-xl transition-all"
          style={{
            opacity: isJoining ? 0.7 : 1
          }}
        >
          {isJoining ? (
            <span className="flex items-center gap-2">
              Joining...
            </span>
          ) : (
            <span className="flex items-center gap-2 justify-center">
              <LogIn size={16} />
              Join Room
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};