'use client';

import { useState } from 'react';
import { Plus, Info } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { AddMediaModal } from './AddMediaModal';
import { useAddMedia } from './hooks/useAddMedia';

interface AddMediaProps {
  roomId: string;
}

export const AddMedia = ({ roomId }: AddMediaProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showComingSoonMessage, setShowComingSoonMessage] = useState(false);
  const colors = getColors();
  const { isAdding, addToPlaylist } = useAddMedia(roomId);

  // Temporary notice component
  const ComingSoonNotice = () => {
    if (!showComingSoonMessage) return null;
    
    return (
      <div 
        className="fixed bottom-20 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom duration-300"
        style={{ 
          backgroundColor: colors.surface,
          border: `1px solid ${colors.primary}30`,
          boxShadow: `0 4px 12px rgba(0,0,0,0.1)`
        }}
      >
        <Info size={16} style={{ color: colors.primary }} />
        <span className="text-sm" style={{ color: colors.text.primary }}>
          Local file streaming is coming soon! 🚀
        </span>
      </div>
    );
  };

  // Create a wrapper for addToPlaylist that shows coming soon message for local files
  const handleAddToPlaylist = (item: any) => {
    if (item.type === 'local') {
      setShowComingSoonMessage(true);
      setTimeout(() => setShowComingSoonMessage(false), 3000);
      return;
    }
    addToPlaylist(item);
  };

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

      <ComingSoonNotice />

      {isOpen && (
        <AddMediaModal
          roomId={roomId}
          onClose={() => setIsOpen(false)}
          onAddToPlaylist={handleAddToPlaylist}
          isAdding={isAdding}
        />
      )}
    </>
  );
};