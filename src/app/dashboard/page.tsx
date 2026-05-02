'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { CreateRoomCard } from '@/components/dashboard/CreateRoomCard';
import { JoinRoomCard } from '@/components/dashboard/JoinRoomCard';
import { RecentHistory } from '@/components/dashboard/RecentHistory';
import { EmptyState } from '@/components/ui/EmptyState';
import { getColors } from '@/store/colorStore';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const mockHistoryItems = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    type: 'online' as const,
    source: 'youtube',
    playedAt: new Date().toISOString(),
    roomId: 'cool-vibes-abc',
    isAvailable: true
  },
  {
    id: '2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    type: 'local' as const,
    source: 'local',
    playedAt: new Date(Date.now() - 86400000).toISOString(),
    roomId: 'cool-vibes-abc',
    isAvailable: true
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomsCreated, setRoomsCreated] = useState(0);
  const [historyItems, setHistoryItems] = useState(mockHistoryItems);

  const colors = getColors();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // FIXED: moved before any return
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const roomCount = Object.keys(localStorage)
        .filter(k => k.startsWith('room_')).length;
      setRoomsCreated(roomCount);
    }
  }, []);

  // Auto-clear error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const totalPlays = historyItems.length;
  const hoursListened = Math.floor(totalPlays * 3.5);
  const missingCount = historyItems.filter(i => !i.isAvailable).length;

  const createRoom = async (roomName: string) => {
    setIsCreating(true);
    setError(null);

    try {
      const adjectives = ['cool', 'vibes', 'chill', 'sweet', 'lively', 'cozy'];
      const nouns = ['music', 'beats', 'sounds', 'waves', 'notes', 'tunes'];

      const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

      const roomId = `${randomAdj}-${randomNoun}-${Math.random()
        .toString(36)
        .substring(2, 5)}`;

      const roomInfo = {
        name: roomName,
        createdAt: new Date().toISOString(),
        host: 'User'
      };

      localStorage.setItem(`room_${roomId}`, JSON.stringify(roomInfo));

      await new Promise(resolve => setTimeout(resolve, 500));
      router.push(`/room/${roomId}?name=${encodeURIComponent(roomName)}&isHost=true`);
    } catch (err) {
      setError('Failed to create room. Please try again.');
      setIsCreating(false);
    }
  };

  const joinRoom = async (roomCode: string) => {
    setIsJoining(true);
    setError(null);

    try {
      const roomData = localStorage.getItem(`room_${roomCode}`);

      if (!roomData) {
        setError('Room not found. Please check the code and try again.');
        setIsJoining(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      router.push(`/room/${roomCode}`);
    } catch (err) {
      setError('Failed to join room. Please try again.');
      setIsJoining(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 space-y-6 pb-8">
        {/* Error Message */}
        {error && (
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: `${colors.status.error}15`,
              border: `1px solid ${colors.status.error}30`
            }}
          >
            <p className="text-sm text-center" style={{ color: colors.status.error }}>
              {error}
            </p>
          </div>
        )}

        {/* Stats */}
        <DashboardStats
          totalPlays={totalPlays}
          hoursListened={hoursListened}
          missingCount={missingCount}
          roomsCreated={roomsCreated}
        />

        {/* Create & Join */}
        <div className="grid lg:grid-cols-2 gap-6">
          <CreateRoomCard onCreateRoom={createRoom} isCreating={isCreating} />
          <JoinRoomCard onJoinRoom={joinRoom} isJoining={isJoining} />
        </div>

        {/* History */}
        {historyItems.length > 0 ? (
          <RecentHistory historyItems={historyItems} />
        ) : (
          <EmptyState
            title="No listening history yet"
            description="Start playing music to see your history here"
          />
        )}
      </div>
    </DashboardLayout>
  );
}