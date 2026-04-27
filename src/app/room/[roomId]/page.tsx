'use client';

import { useParams } from 'next/navigation';
import { RoomProvider } from '@/contexts/RoomContext';
import { VideoPlayer } from '@/components/room/VideoPlayer';
import { Chat } from '@/components/room/Chat';
import { Queue } from '@/components/room/Queue';
import { AddMedia } from '@/components/room/AddMedia';
import { Participants } from '@/components/room/Participants';
import { getColors } from '@/store/colorStore';

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const colors = getColors();

  return (
    <RoomProvider roomId={roomId}>
      <div className="min-h-screen p-4" style={{ backgroundColor: colors.background }}>
        <div className="max-w-7xl mx-auto">
          {/* Room Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Room: {roomId}
            </h1>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Left Column - Video Player */}
            <div className="lg:col-span-2 space-y-4">
              <VideoPlayer />
              <Participants />
            </div>

            {/* Right Column - Chat & Queue */}
            <div className="space-y-4">
              <div className="h-96">
                <Chat />
              </div>
              <div className="h-80">
                <Queue />
              </div>
              <AddMedia />
            </div>
          </div>
        </div>
      </div>
    </RoomProvider>
  );
}