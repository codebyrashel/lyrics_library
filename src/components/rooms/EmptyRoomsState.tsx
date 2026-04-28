'use client';

import { DoorOpen, Plus } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';

interface EmptyRoomsStateProps {
  onCreateRoom: () => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const EmptyRoomsState = ({ onCreateRoom, searchQuery, onClearSearch }: EmptyRoomsStateProps) => {
  const colors = getColors();
  
  if (searchQuery) {
    return (
      <div className="text-center py-16 rounded-xl" style={{ backgroundColor: colors.surface }}>
        <DoorOpen size={48} style={{ color: colors.text.muted }} className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
          No rooms found
        </h3>
        <p className="mb-4" style={{ color: colors.text.muted }}>
          No rooms match &quot;{searchQuery}&quot;
        </p>
        {onClearSearch && (
          <Button variant="outline" onClick={onClearSearch}>
            Clear Search
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="text-center py-16 rounded-xl" style={{ backgroundColor: colors.surface }}>
      <DoorOpen size={48} style={{ color: colors.text.muted }} className="mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
        No rooms yet
      </h3>
      <p className="mb-4" style={{ color: colors.text.muted }}>
        Create a new room or join one using an invite link
      </p>
      <Button variant="primary" onClick={onCreateRoom} className='inline-flex items-center'>
        <Plus size={18} className="mr-2" />
        Create New Room
      </Button>
    </div>
  );
};