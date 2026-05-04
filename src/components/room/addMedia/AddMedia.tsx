'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { AddMediaModal } from './AddMediaModal';
import { useAddMedia } from './hooks/useAddMedia';

interface AddMediaProps {
  roomId: string;
}

export const AddMedia = ({ roomId }: AddMediaProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const colors = getColors();
  const { isAdding, addToPlaylist } = useAddMedia(roomId);

  return (
    <>
      <Button 
        variant="primary" 
        onClick={() => setIsOpen(true)} 
        className="flex items-center justify-center gap-2"
        disabled={isAdding}
      >
        <Plus size={18} />
        <span>Add to Watchlist</span>
      </Button>

      {isOpen && (
        <AddMediaModal
          roomId={roomId}
          onClose={() => setIsOpen(false)}
          onAddToPlaylist={addToPlaylist}
          isAdding={isAdding}
        />
      )}
    </>
  );
};