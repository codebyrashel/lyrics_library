'use client';

import { Music, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getColors } from '@/store/colorStore';

interface LibraryEmptyStateProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onCreatePlaylist?: () => void;
}

export const LibraryEmptyState = ({ searchQuery, onClearSearch, onCreatePlaylist }: LibraryEmptyStateProps) => {
  const colors = getColors();
  
  if (searchQuery) {
    return (
      <>
        <AlertCircle size={48} style={{ color: colors.text.muted }} className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
          No playlists found
        </h3>
        <p className="mb-4" style={{ color: colors.text.muted }}>
          No playlists match &quot;{searchQuery}&quot;
        </p>
        <Button variant="outline" onClick={onClearSearch}>
          Clear Search
        </Button>
      </>
    );
  }
  
  return (
    <>
      <Music size={48} style={{ color: colors.text.muted }} className="mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
        No playlists yet
      </h3>
      <p className="mb-4" style={{ color: colors.text.muted }}>
        Create your first playlist to get started
      </p>
      <Button variant="primary" onClick={onCreatePlaylist}>
        <Plus size={18} className="mr-2 inline-flex" />
        Create Playlist
      </Button>
    </>
  );
};

