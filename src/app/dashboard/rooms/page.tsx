'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomsTabs } from '@/components/rooms/RoomsTabs';
import { EmptyRoomsState } from '@/components/rooms/EmptyRoomsState';
import { DemoNotice } from '@/components/rooms/DemoNotice';
import { TipsSection } from '@/components/rooms/TipsSection';
import { getSavedRooms, SavedRoom, removeRoom } from '@/store/savedRoomsStore';

const dummyRooms: SavedRoom[] = [
  { id: 'chill-vibes-abc123', name: 'Friday Night Vibes', createdAt: '2024-01-15T20:00:00.000Z', lastVisited: '2024-01-20T22:30:00.000Z', isActive: true, participantCount: 5, isCreator: true },
  { id: 'study-session-xyz789', name: 'Study Session - Calculus', createdAt: '2024-01-18T15:00:00.000Z', lastVisited: '2024-01-19T18:00:00.000Z', isActive: true, participantCount: 3, isCreator: false },
  { id: 'movie-night-def456', name: 'Movie Night: Inception', createdAt: '2024-01-10T19:00:00.000Z', lastVisited: '2024-01-10T23:00:00.000Z', isActive: false, participantCount: 0, isCreator: true },
  { id: 'music-party-ghi789', name: 'Music Listening Party', createdAt: '2024-01-05T21:00:00.000Z', lastVisited: '2024-01-12T20:00:00.000Z', isActive: false, participantCount: 0, isCreator: false },
  { id: 'gaming-sesh-jkl012', name: 'Gaming and Chill', createdAt: '2024-01-08T22:00:00.000Z', lastVisited: '2024-01-14T23:30:00.000Z', isActive: true, participantCount: 8, isCreator: false },
  { id: 'podcast-club-mno345', name: 'Podcast Club', createdAt: '2024-01-03T14:00:00.000Z', lastVisited: '2024-01-17T16:00:00.000Z', isActive: false, participantCount: 0, isCreator: true },
];

export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<SavedRoom[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'recent'>('all');
  const [showDummyData, setShowDummyData] = useState(true);
  const colors = getColors();

  useEffect(() => {
    if (showDummyData) {
      setRooms(dummyRooms);
    } else {
      const savedRooms = getSavedRooms();
      setRooms(savedRooms.length > 0 ? savedRooms : dummyRooms);
    }
  }, [showDummyData]);

  const filteredRooms = rooms.filter(room => {
    if (activeTab === 'active') return room.isActive;
    if (activeTab === 'recent') return !room.isActive;
    return true;
  });

  const counts = {
    all: rooms.length,
    active: rooms.filter(r => r.isActive).length,
    recent: rooms.filter(r => !r.isActive).length,
  };

  const handleJoinRoom = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.text.primary }}>
              My Rooms
            </h1>
            <p className="text-sm sm:text-base mt-1" style={{ color: colors.text.muted }}>
              Manage and rejoin your rooms
            </p>
          </div>
          <Button variant="primary" onClick={() => router.push('/dashboard')} className='inline-flex items-center'>
            <Plus size={18} className="mr-2" />
            Create New Room
          </Button>
        </div>

        <DemoNotice 
          showDummyData={showDummyData}
          onToggle={() => setShowDummyData(false)}
        />

        <RoomsTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />

        {filteredRooms.length > 0 ? (
          <div className="space-y-3">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} onJoin={handleJoinRoom} />
            ))}
          </div>
        ) : (
          <EmptyRoomsState onCreateRoom={() => router.push('/dashboard')} />
        )}

        <TipsSection />
      </div>
    </DashboardLayout>
  );
}