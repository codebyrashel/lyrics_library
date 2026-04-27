'use client';

import { Video, Music, ExternalLink, AlertCircle } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface HistoryItemProps {
  id: string;
  title: string;
  artist: string;
  type: 'online' | 'local';
  source: string;
  playedAt: string;
  roomId: string;
  isAvailable: boolean;
}

export const HistoryItem = ({
  title,
  artist,
  type,
  source,
  playedAt,
  roomId,
  isAvailable
}: HistoryItemProps) => {
  const colors = getColors();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg gap-3 transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: colors.background,
        border: !isAvailable ? `1px solid ${colors.status.error}30` : `1px solid ${colors.surface}`
      }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {source === 'youtube' && (
            <Video size={16} style={{ color: '#FF0000' }} />
          )}

          {source === 'local' && (
            <Music size={16} style={{ color: colors.primary }} />
          )}

          <h3
            className="font-semibold"
            style={{
              color: isAvailable ? colors.text.primary : colors.status.error,
              textDecoration: isAvailable ? 'none' : 'line-through'
            }}
          >
            {title}
          </h3>

          {!isAvailable && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${colors.status.error}15`,
                color: colors.status.error
              }}
            >
              Missing
            </span>
          )}
        </div>

        <p className="text-sm" style={{ color: colors.text.muted }}>
          {artist} • {type === 'online' ? 'Online' : 'Local'} • Room: {roomId} • {formatDate(playedAt)}
        </p>
      </div>

      {isAvailable && (
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 self-start sm:self-center"
          style={{
            backgroundColor: `${colors.primary}10`,
            color: colors.primary
          }}
        >
          <ExternalLink size={14} />
          Play Again
        </button>
      )}

      {!isAvailable && (
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 self-start sm:self-center"
          style={{
            backgroundColor: colors.primary,
            color: 'white'
          }}
        >
          <AlertCircle size={14} />
          Find Alternative
        </button>
      )}
    </div>
  );
};