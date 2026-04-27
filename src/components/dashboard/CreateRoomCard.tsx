'use client';

import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';

interface CreateRoomCardProps {
  onCreateRoom: (roomName: string) => void;
  isCreating: boolean;
}

export const CreateRoomCard = ({ onCreateRoom, isCreating }: CreateRoomCardProps) => {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const colors = getColors();

  const validateRoomName = (name: string) => {
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Room name is required');
      return false;
    }
    if (trimmed.length < 3) {
      setError('Room name must be at least 3 characters');
      return false;
    }
    if (trimmed.length > 30) {
      setError('Room name must be less than 30 characters');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = () => {
    const cleaned = roomName.trim();
    if (validateRoomName(cleaned)) {
      onCreateRoom(cleaned);
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
          <Plus size={20} style={{ color: colors.primary }} />
        </div>

        <div>
          <h3 className="font-semibold text-base" style={{ color: colors.text.primary }}>
            Create a Room
          </h3>
          <p className="text-sm mt-0.5" style={{ color: colors.text.muted }}>
            Give it a name and start something new
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. Chill Vibes"
            value={roomName}
            onChange={(e) => {
              setRoomName(e.target.value);
              if (error) validateRoomName(e.target.value);
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
          variant="primary"
          onClick={handleSubmit}
          disabled={isCreating || !roomName.trim()}
          className="w-full py-2.5 rounded-xl transition-all"
          style={{
            opacity: isCreating ? 0.7 : 1
          }}
        >
          {isCreating ? (
            <span className="flex items-center gap-2 justify-center">
              Creating...
            </span>
          ) : (
            <span className="flex items-center gap-2 justify-center">
              <Sparkles size={16} />
              Create Room
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};