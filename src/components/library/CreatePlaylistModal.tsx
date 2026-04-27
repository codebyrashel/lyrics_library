'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getColors } from '@/store/colorStore';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const CreatePlaylistModal = ({ isOpen, onClose, onCreate }: CreatePlaylistModalProps) => {
  const [name, setName] = useState('');
  const colors = getColors();
  
  if (!isOpen) return null;
  
  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name);
      setName('');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-xl max-w-md w-full p-6"
        style={{ backgroundColor: colors.surface }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Create New Playlist
        </h2>
        <input
          type="text"
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.text.muted}30`,
            color: colors.text.primary
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
          autoFocus
        />
        <div className="flex gap-3">
          <Button variant="primary" onClick={handleCreate} className="flex-1">
            Create
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              onClose();
              setName('');
            }}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};