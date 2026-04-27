'use client';

import { Music, Play, Trash2 } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface PlaylistCardProps {
  id: string;
  name: string;
  songCount: number;
  createdAt: string;
  coverColor: string;
  onPlay: () => void;
  onDelete: () => void;
}

export const PlaylistCard = ({ name, songCount, createdAt, coverColor, onPlay, onDelete }: PlaylistCardProps) => {
  const colors = getColors();
  
  return (
    <div
      className="group rounded-xl p-4 transition-all duration-300 hover:scale-105 cursor-pointer"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      {/* Playlist Cover */}
      <div 
        className="w-full aspect-square rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: coverColor }}
      >
        <Music size={48} className="text-white opacity-50" />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity flex items-center justify-center">
          <Play size={32} className="text-white" />
        </div>
      </div>
      
      {/* Playlist Info */}
      <h3 className="font-semibold truncate" style={{ color: colors.text.primary }}>
        {name}
      </h3>
      <p className="text-sm mt-1" style={{ color: colors.text.muted }}>
        {songCount} songs • Created {new Date(createdAt).toLocaleDateString()}
      </p>
      
      {/* Actions */}
      <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={onPlay}
          className="p-1.5 rounded-lg transition-all hover:scale-105"
          style={{ color: colors.text.secondary }}
        >
          <Play size={16} />
        </button>
        <button 
          onClick={onDelete}
          className="p-1.5 rounded-lg transition-all hover:scale-105"
          style={{ color: colors.status.error }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};