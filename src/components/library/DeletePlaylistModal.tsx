'use client';

import { Button } from '@/components/ui/Button';
import { getColors } from '@/store/colorStore';

interface DeletePlaylistModalProps {
  isOpen: boolean;
  playlistName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePlaylistModal = ({ isOpen, playlistName, onClose, onConfirm }: DeletePlaylistModalProps) => {
  const colors = getColors();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-xl max-w-md w-full p-6"
        style={{ backgroundColor: colors.surface }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Delete Playlist?
        </h2>
        <p className="mb-6" style={{ color: colors.text.secondary }}>
          Are you sure you want to delete &quot;{playlistName}&quot;? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="primary" onClick={onConfirm} className="flex-1">
            Delete
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};