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
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Get room details
        const roomResponse = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        const roomData = await roomResponse.json();

        if (roomData.success) {
          // Notify via WebSocket that user joined
          wsService.send('room:join', {
            roomId,
            userId: localStorage.getItem('user_id'),
            name: roomData.room?.name,
          });

          // Navigate to room
          router.push(`/room/${roomId}?name=${encodeURIComponent(roomData.room?.name || 'Room')}`);
        } else {
          setError(roomData.message || 'Failed to get room details');
        }
      } else {
        setError(data.message || 'Room not found or inactive');
      }
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