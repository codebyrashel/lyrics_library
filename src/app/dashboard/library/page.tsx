'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { PlaylistCard } from '@/components/library/PlaylistCard';
import { SearchBar } from '@/components/library/SearchBar';
import { CreatePlaylistModal } from '@/components/library/CreatePlaylistModal';
import { DeletePlaylistModal } from '@/components/library/DeletePlaylistModal';
import { LibraryEmptyState } from '@/components/library/LibraryEmptyState';

interface Playlist {
  id: string;
  name: string;
  songCount: number;
  createdAt: string;
  coverColor: string;
}

export default function LibraryPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const colors = getColors();

  useEffect(() => {
    const saved = localStorage.getItem('lyrics_library_playlists');
    if (saved) {
      setPlaylists(JSON.parse(saved));
    } else {
      const defaults = [
        { id: '1', name: 'Chill Vibes', songCount: 12, createdAt: new Date().toISOString(), coverColor: '#3B82F6' },
        { id: '2', name: 'Workout Mix', songCount: 8, createdAt: new Date().toISOString(), coverColor: '#EF4444' },
        { id: '3', name: 'Road Trip', songCount: 15, createdAt: new Date().toISOString(), coverColor: '#10B981' },
      ];
      setPlaylists(defaults);
      localStorage.setItem('lyrics_library_playlists', JSON.stringify(defaults));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('lyrics_library_playlists', JSON.stringify(playlists));
    }
  }, [playlists, isLoading]);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const filterPlaylists = useCallback((query: string) => {
    if (!query.trim()) return;
  }, []);

  const debouncedSearch = useCallback(debounce(filterPlaylists, 300), [filterPlaylists]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const clearSearch = () => setSearchQuery('');

  const createPlaylist = (name: string) => {
    const colorsList = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'];
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: name.trim(),
      songCount: 0,
      createdAt: new Date().toISOString(),
      coverColor: colorsList[Math.floor(Math.random() * colorsList.length)],
    };
    setPlaylists([newPlaylist, ...playlists]);
    setShowCreateModal(false);
  };

  const deletePlaylist = () => {
    if (showDeleteModal) {
      setPlaylists(playlists.filter(p => p.id !== showDeleteModal.id));
      setShowDeleteModal(null);
    }
  };

  const filteredPlaylists = searchQuery 
    ? playlists.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : playlists;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: colors.primary }}></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.text.primary }}>
              Your Library
            </h1>
            <p className="text-sm sm:text-base mt-1" style={{ color: colors.text.muted }}>
              Create and manage your playlists
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} className="mr-2" />
            Create Playlist
          </Button>
        </div>

        <div className="mb-8">
          <SearchBar value={searchQuery} onChange={handleSearchChange} onClear={clearSearch} />
        </div>

        {filteredPlaylists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                {...playlist}
                onPlay={() => console.log('Play:', playlist.name)}
                onDelete={() => setShowDeleteModal(playlist)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <LibraryEmptyState 
              searchQuery={searchQuery}
              onClearSearch={clearSearch}
              onCreatePlaylist={() => setShowCreateModal(true)}
            />
          </div>
        )}
      </div>

      <CreatePlaylistModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createPlaylist}
      />

      <DeletePlaylistModal 
        isOpen={!!showDeleteModal}
        playlistName={showDeleteModal?.name || ''}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={deletePlaylist}
      />
    </DashboardLayout>
  );
}