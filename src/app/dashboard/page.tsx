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
import { guestService } from '@/services/guest.service';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomsCreated, setRoomsCreated] = useState(0);
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  const colors = getColors();
  const isGuest = !isAuthenticated && !isLoading;

  // Redirect authenticated users to login? No - guests should see dashboard too
  // But we need to handle guest vs authenticated differently

  // Load rooms created count for authenticated users only
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    
    const loadUserRooms = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${user.id}/rooms`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        
        if (!response.ok) {
          console.log('Rooms endpoint not implemented yet');
          return;
        }
        
        const text = await response.text();
        const data = JSON.parse(text);
        if (data.success) {
          setRoomsCreated(data.rooms.length);
        }
      } catch (error) {
        console.log('Rooms endpoint not available:', error);
        setRoomsCreated(0);
      }
    };

    loadUserRooms();
  }, [user, isAuthenticated]);

  // For guests, get rooms created from localStorage
  useEffect(() => {
    if (isGuest) {
      const activity = guestService.getActivity();
      if (activity) {
        setRoomsCreated(activity.roomsCreated);
      }
    }
  }, [isGuest]);

  // Load history for authenticated users only
  useEffect(() => {
    if (!isAuthenticated) return;
    
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
        setHistoryItems([]);
      }
    };

    loadHistory();
  }, [isAuthenticated]);

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
      const token = localStorage.getItem('auth_token');
      const isGuestUser = !token;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // If guest, add guest ID header
      if (isGuestUser) {
        const guestId = guestService.getGuestId();
        headers['X-Guest-ID'] = guestId;
      } else {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:8080/api/rooms', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: roomName }),
      });

      const data = await response.json();

      if (data.success) {
        // Track room creation for guests
        if (isGuestUser) {
          guestService.incrementRoomsCreated();
          setRoomsCreated(prev => prev + 1);
        } else {
          setRoomsCreated(prev => prev + 1);
        }
        
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
      const token = localStorage.getItem('auth_token');
      const isGuestUser = !token;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (isGuestUser) {
        const guestId = guestService.getGuestId();
        headers['X-Guest-ID'] = guestId;
      } else {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8080/api/rooms/${roomCode}/join`, {
        method: 'POST',
        headers,
      });

      const data = await response.json();

      if (data.success) {
        // Track room joining for guests
        if (isGuestUser) {
          guestService.incrementRoomsJoined();
        }
        
        // Notify via WebSocket (only if authenticated)
        if (!isGuestUser && user?.id) {
          wsService.send('room:join', {
            roomId: roomCode,
            userId: user.id,
            name: user.name,
          });
        }

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: colors.primary }} />
      </div>
    );
  }

  const totalPlays = historyItems.length;
  const hoursListened = Math.floor(totalPlays * 3.5);
  const missingCount = historyItems.filter(i => !i.isAvailable).length;
  const remainingRooms = isGuest ? guestService.getRemainingRooms() : Infinity;

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
            {isGuest ? 'Welcome, Guest!' : `Welcome back, ${user?.name}!`}
          </h2>
          <p className="text-sm mt-1" style={{ color: colors.text.muted }}>
            Create a new room or join an existing one to watch together with friends
          </p>
          {isGuest && (
            <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: colors.primary }}>
              <span>⚡ Guest mode: {remainingRooms} rooms remaining (max 3)</span>
              <button 
                onClick={() => router.push('/register')}
                className="underline hover:opacity-80"
              >
                Sign up for unlimited
              </button>
            </div>
          )}
        </div>

        {/* Stats - Only show for authenticated users */}
        {isAuthenticated && (
          <DashboardStats
            totalPlays={totalPlays}
            hoursListened={hoursListened}
            missingCount={missingCount}
            roomsCreated={roomsCreated}
          />
        )}

        {/* Create & Join */}
        <div className="grid lg:grid-cols-2 gap-6">
          <CreateRoomCard onCreateRoom={createRoom} isCreating={isCreating} />
          <JoinRoomCard onJoinRoom={joinRoom} isJoining={isJoining} />
        </div>

        {/* History - Only show for authenticated users */}
        {isAuthenticated && (
          historyItems.length > 0 ? (
            <RecentHistory historyItems={historyItems} />
          ) : (
            <EmptyState
              title="No listening history yet"
              description="Start playing music in rooms to see your history here"
            />
          )
        )}
      </div>
    </DashboardLayout>
  );
}