'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogIn, Sparkles, ArrowRight, Users, Video, MessageCircle, Lock } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { guestService } from '@/services/guest.service';

export const HeroSection = () => {
  const router = useRouter();
  const colors = getColors();
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError('');

    try {
      const roomName = `${getRandomAdjective()}-${getRandomNoun()}-${Math.random().toString(36).substring(2, 6)}`;
      const guestId = guestService.getGuestId();

      const response = await fetch('http://localhost:8080/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Guest-ID': guestId,
        },
        body: JSON.stringify({ name: roomName }),
      });

      const data = await response.json();

      if (data.success) {
        guestService.incrementRoomsCreated();
        router.push(`/guest-room/${data.roomId}?name=${encodeURIComponent(roomName)}&isHost=true`);
      } else {
        setError(data.message || 'Failed to create room');
      }
    } catch (err) {
      setError('Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const guestId = guestService.getGuestId();

      const response = await fetch(`http://localhost:8080/api/rooms/${roomCode.trim()}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Guest-ID': guestId,
        },
      });

      const data = await response.json();

      if (data.success) {
        guestService.incrementRoomsJoined();
        router.push(`/guest-room/${roomCode.trim()}?name=${encodeURIComponent(data.roomName || 'Room')}`);
      } else {
        setError(data.message || 'Room not found');
      }
    } catch (err) {
      setError('Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const getRandomAdjective = () => {
    const adjectives = ['cool', 'chill', 'vibes', 'sweet', 'lively', 'cozy', 'epic', 'fun'];
    return adjectives[Math.floor(Math.random() * adjectives.length)];
  };

  const getRandomNoun = () => {
    const nouns = ['music', 'beats', 'sounds', 'waves', 'notes', 'tunes', 'party', 'hangout'];
    return nouns[Math.floor(Math.random() * nouns.length)];
  };

  const features = [
    { icon: Video, label: 'YouTube & Local Files' },
    { icon: Users, label: 'Up to 3 Viewers' },
    { icon: MessageCircle, label: 'Real-time Chat' },
    { icon: Lock, label: 'Private Rooms' },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
              style={{ backgroundColor: `${colors.primary}10` }}
            >
              <Sparkles size={14} style={{ color: colors.primary }} />
              <span className="text-sm font-medium" style={{ color: colors.primary }}>
                Free. No account needed.
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ color: colors.text.primary }}
            >
              Watch together.
              <br />
              <span style={{ color: colors.primary }}>Anywhere, anytime.</span>
            </h1>

            <p className="text-lg mb-8" style={{ color: colors.text.secondary }}>
              Create a private room, share the link, and watch YouTube or local files
              with friends in perfect sync. No signup required.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${colors.primary}10` }}
                    >
                      <Icon size={12} style={{ color: colors.primary }} />
                    </div>
                    <span className="text-sm" style={{ color: colors.text.muted }}>
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Login Link */}
            <div>
              <button
                onClick={() => router.push('/login')}
                className="text-sm flex items-center gap-1 transition-colors"
                style={{ color: colors.text.muted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.muted;
                }}
              >
                <LogIn size={14} />
                Already have an account? Sign in
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Right Column - Action Card */}
          <div>
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.text.muted}20`,
                boxShadow: `0 20px 40px -12px rgba(0,0,0,0.1)`
              }}
            >
              {/* Tabs */}
              <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ backgroundColor: `${colors.text.muted}10` }}>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${activeTab === 'create' ? 'shadow-sm' : ''
                    }`}
                  style={{
                    backgroundColor: activeTab === 'create' ? colors.background : 'transparent',
                    color: activeTab === 'create' ? colors.primary : colors.text.muted,
                  }}
                >
                  Create Room
                </button>
                <button
                  onClick={() => setActiveTab('join')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${activeTab === 'join' ? 'shadow-sm' : ''
                    }`}
                  style={{
                    backgroundColor: activeTab === 'join' ? colors.background : 'transparent',
                    color: activeTab === 'join' ? colors.primary : colors.text.muted,
                  }}
                >
                  Join Room
                </button>
              </div>

              {/* Create Room Content */}
              {activeTab === 'create' && (
                <div className="h-[320px] flex flex-col text-center">
                  <div className="flex-1 flex flex-col justify-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${colors.primary}10` }}
                    >
                      <Plus size={32} style={{ color: colors.primary }} />
                    </div>

                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>
                      Start watching now
                    </h3>

                    <p className="text-sm mb-6" style={{ color: colors.text.muted }}>
                      Create a room and invite friends to join
                    </p>

                    <button
                      onClick={handleCreateRoom}
                      disabled={isCreating}
                      className="w-full h-12 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                      style={{ backgroundColor: colors.primary, color: 'white' }}
                    >
                      <Plus size={18} />
                      {isCreating ? 'Creating...' : 'Create New Room'}
                    </button>
                  </div>

                  {/* reserve error space */}
                  <div className="h-6 mt-2">
                    {error && (
                      <p className="text-xs text-center" style={{ color: colors.status.error }}>
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Join Room Content */}
              {activeTab === 'join' && (
                <div className="h-[320px] flex flex-col text-center">
                  <div className="flex-1 flex flex-col justify-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${colors.primary}10` }}
                    >
                      <LogIn size={32} style={{ color: colors.primary }} />
                    </div>

                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>
                      Join existing room
                    </h3>

                    <p className="text-sm mb-6" style={{ color: colors.text.muted }}>
                      Enter the room code shared by your friend
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        placeholder="Room code"
                        className="flex-1 px-4 h-12 rounded-xl focus:outline-none"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.text.muted}30`,
                          color: colors.text.primary,
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                      />

                      <button
                        onClick={handleJoinRoom}
                        disabled={isJoining}
                        className="px-6 h-12 rounded-xl font-medium transition-all flex items-center justify-center whitespace-nowrap"
                        style={{ backgroundColor: colors.primary, color: 'white' }}
                      >
                        {isJoining ? 'Joining...' : 'Join'}
                      </button>
                    </div>
                  </div>

                  {/* reserve error space */}
                  <div className="h-6 mt-2">
                    {error && (
                      <p className="text-xs text-center" style={{ color: colors.status.error }}>
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Footer Note */}
              <p className="text-xs text-center mt-6 pt-4 border-t" style={{ borderColor: `${colors.text.muted}20`, color: colors.text.muted }}>
                No credit card required • Free forever
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};