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
import { wsService } from '@/services/websocket.service';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomsCreated, setRoomsCreated] = useState(0);
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  const colors = getColors();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load rooms created by user from backend
  useEffect(() => {
    const loadUserRooms = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`http://localhost:8080/api/users/${user.id}/rooms`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setRoomsCreated(data.rooms.length);
        }
      } catch (error) {
        console.error('Failed to load user rooms:', error);
      }
    };

    loadUserRooms();
  }, [user]);

  // Load history from backend
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/history`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        const data = await response.json();
        if (data.success && data.history) {
          setHistoryItems(data.history);
        }
      } catch (error) {
        console.error('Failed to load history:', error);
        // Fallback to mock data if backend not ready
        setHistoryItems([
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
        ]);
      }
    };

    loadHistory();
  }, []);

  // Auto-clear error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const createRoom = async (roomName: string) => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ name: roomName }),
      });

      const data = await response.json();

      if (data.success) {
        // Update rooms created count
        setRoomsCreated(prev => prev + 1);
        
        // Navigate to the new room
        router.push(`/room/${data.roomId}?name=${encodeURIComponent(roomName)}&isHost=true`);
      } else {
        setError(data.message || 'Failed to create room');
        setIsCreating(false);
      }
    } catch (err) {
      console.error('Create room error:', err);
      setError('Failed to create room. Please try again.');
      setIsCreating(false);
    }
  };

  const joinRoom = async (roomCode: string) => {
    setIsJoining(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${roomCode}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Notify via WebSocket
        wsService.send('room:join', {
          roomId: roomCode,
          userId: user?.id,
          name: user?.name,
        });

        // Navigate to the room
        router.push(`/room/${roomCode}?name=${encodeURIComponent(data.roomName || 'Room')}`);
      } else {
        setError(data.message || 'Room not found. Please check the code and try again.');
        setIsJoining(false);
      }
    } catch (err) {
      console.error('Join room error:', err);
      setError('Failed to join room. Please try again.');
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: colors.primary }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const totalPlays = historyItems.length;
  const hoursListened = Math.floor(totalPlays * 3.5);
  const missingCount = historyItems.filter(i => !i.isAvailable).length;

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

        {/* Welcome Banner */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: `${colors.primary}10`,
            border: `1px solid ${colors.primary}20`,
          }}
        >
          <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
            Welcome back, {user?.name}!
          </h2>
          <p className="text-sm mt-1" style={{ color: colors.text.muted }}>
            Create a new room or join an existing one to watch together with friends
          </p>
        </div>

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
            description="Start playing music in rooms to see your history here"
          />
        )}
      </div>
    </DashboardLayout>
  );
}