'use client';

import { Trash2, Music, Video, GripVertical } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useRoom } from '@/contexts/RoomContext';
import { AddMedia } from './AddMedia';

export const Queue = () => {
  const colors = getColors();
  const { queue, removeFromQueue, setCurrentPlaying } = useRoom();

  const playNext = (item: any) => {
    setCurrentPlaying(item);
  };

  return (
    <div 
      className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div className="p-3 border-b flex justify-between items-center shrink-0" style={{ borderColor: `${colors.text.muted}20` }}>
        <h3 className="font-semibold" style={{ color: colors.text.primary }}>
          Queue ({queue.length})
        </h3>
        <AddMedia />
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {queue.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: colors.text.muted }}>
            Queue is empty. Add some media!
          </p>
        ) : (
          queue.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-opacity-80 relative group"
              style={{ backgroundColor: colors.background }}
              onClick={() => playNext(item)}
            >
              <GripVertical size={14} className="shrink-0" style={{ color: colors.text.muted }} />
              {item.type === 'youtube' ? (
                <Video size={16} className="shrink-0" style={{ color: '#FF0000' }} />
              ) : (
                <Music size={16} className="shrink-0" style={{ color: colors.primary }} />
              )}
              <div className="flex-1 min-w-0">
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
                className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200 hover:scale-110"
                style={{ color: colors.status.error }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${colors.text.muted}10;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.text.muted}30;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${colors.text.muted}50;
        }
      `}</style>
    </div>
  );
};