'use client';

import { Trash2, Music, Video, GripVertical } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useRoom } from '@/contexts/RoomContext';

export const Queue = () => {
  const colors = getColors();
  const { queue, removeFromQueue, setCurrentPlaying, currentPlaying } = useRoom();

  const playNext = (item: any) => {
    setCurrentPlaying(item);
  };

  return (
    <div 
      className="flex flex-col h-full rounded-xl"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div className="p-3 border-b" style={{ borderColor: `${colors.text.muted}20` }}>
        <h3 className="font-semibold" style={{ color: colors.text.primary }}>Queue ({queue.length})</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {queue.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: colors.text.muted }}>
            Queue is empty. Add some media!
          </p>
        ) : (
          queue.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer group hover:scale-105 transition"
              style={{ backgroundColor: colors.background }}
              onClick={() => playNext(item)}
            >
              <GripVertical size={14} style={{ color: colors.text.muted }} />
              {item.type === 'youtube' ? (
                <Video size={16} style={{ color: '#FF0000' }} />
              ) : (
                <Music size={16} style={{ color: colors.primary }} />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium truncate" style={{ color: colors.text.primary }}>
                  {item.title}
                </p>
                <p className="text-xs" style={{ color: colors.text.muted }}>
                  Added by {item.addedBy} • #{index + 1}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromQueue(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded transition"
                style={{ color: colors.status.error }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};