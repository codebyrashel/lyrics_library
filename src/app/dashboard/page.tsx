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
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const colors = getColors();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

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

  // Load history - This endpoint doesn't exist yet, so we'll use mock data or skip
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadHistory = async () => {
      setIsLoadingHistory(true);
      try {
        // This endpoint doesn't exist yet. For now, use empty array
        // TODO: Implement history endpoint when ready
        setHistoryItems([]);
      } catch (error) {
        console.error('Failed to load history:', error);
        setHistoryItems([]);
      } finally {
        setIsLoadingHistory(false);
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
      if (!token) {
        setError('You must be logged in to create a room');
        setIsCreating(false);
        return;
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const url = 'http://localhost:8080/api/rooms';
      console.debug('[Dashboard] Creating room', { url, roomName, headers });
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: roomName }),
      });

      const responseText = await response.text();
      console.debug('[Dashboard] Create room response', { status: response.status, text: responseText });
      if (!response.ok) {
        console.error('Create room failed:', response.status, responseText);
        setError(responseText || 'Failed to create room');
        setIsCreating(false);
        return;
      }

      const data = JSON.parse(responseText);

      if (data.success) {
        setRoomsCreated(prev => prev + 1);
        router.push(`/room/${data.roomId}?name=${encodeURIComponent(data.roomName || roomName)}&isHost=true`);
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
      const guestId = localStorage.getItem('guest_session_id');

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (guestId) {
        headers['X-Guest-ID'] = guestId;
      }

      const encodedRoomCode = encodeURIComponent(roomCode);
      const url = `http://localhost:8080/api/rooms/${encodedRoomCode}/join`;
      console.debug('[Dashboard] Joining room', { url, roomCode, headers });
      const response = await fetch(url, {
        method: 'POST',
        headers,
      });

      const responseText = await response.text();
      console.debug('[Dashboard] Join room response', { status: response.status, contentType: response.headers.get('content-type'), text: responseText });
      let data: Record<string, unknown> = { success: false, message: 'Unknown error' };
      try {
        const parsed = responseText ? JSON.parse(responseText) : data;
        if (parsed && typeof parsed === 'object') {
          data = parsed as Record<string, unknown>;
        }
      } catch (parseError) {
        console.error('[Dashboard] Failed to parse join response JSON', parseError, responseText);
        data.message = responseText;
      }

      const dataSuccess = data.success === true;
      const dataMessage = typeof data.message === 'string' ? data.message : 'Room not found. Please check the code and try again.';
      if (!response.ok || !dataSuccess) {
        setError(`${dataMessage} (${response.status})`);
        setIsJoining(false);
        return;
      }

      if (user?.id) {
        wsService.send('room:join', {
          roomId: roomCode,
          userId: user.id,
          name: user.name,
        });
      }

      const isGuest = data.isGuest === true;
      const guestName = typeof data.guestName === 'string' ? data.guestName : undefined;
      const roomName = typeof data.roomName === 'string' ? data.roomName : 'Room';
      const roomPath = isGuest ? `/guest-room/${roomCode}` : `/room/${roomCode}`;
      const query = `?name=${encodeURIComponent(roomName)}` + (isGuest && guestName ? `&guestName=${encodeURIComponent(guestName)}` : '');
      router.push(`${roomPath}${query}`);
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

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const totalPlays = historyItems.length;
  const hoursListened = Math.floor(totalPlays * 3.5);
  const missingCount = historyItems.filter((i: any) => !i.isAvailable).length;

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

        {/* History - Temporarily disabled until endpoint is implemented */}
        {/* 
        {historyItems.length > 0 ? (
          <RecentHistory historyItems={historyItems} />
        ) : !isLoadingHistory && (
          <EmptyState
            title="No listening history yet"
            description="Start playing music in rooms to see your history here"
          />
        )}
        */}
      </div>
    </DashboardLayout>
  );
}