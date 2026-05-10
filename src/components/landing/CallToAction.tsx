'use client';

import { useRouter } from 'next/navigation';
import { Plus, Sparkles, ArrowRight, Users, Video, MessageCircle } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { guestService } from '@/services/guest.service';
import { Button } from '@/components/ui/Button';

export const CallToAction = () => {
    const router = useRouter();
    const colors = getColors();

    const handleCreateRoom = async () => {
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
            
            // Sync guest name with backend response
            if (data.guestName) {
                guestService.syncGuestNameWithBackend(data.guestName);
            }
            
            const guestName = data.guestName || guestService.getGuestName();
            
            // Navigate to guest-room (not room) for guests
            router.push(`/guest-room/${data.roomId}?name=${encodeURIComponent(roomName)}&isHost=true&guestName=${encodeURIComponent(guestName)}`);
        }
    };

    const getRandomAdjective = () => {
        const adjectives = ['cool', 'chill', 'vibes', 'sweet', 'lively', 'cozy'];
        return adjectives[Math.floor(Math.random() * adjectives.length)];
    };

    const getRandomNoun = () => {
        const nouns = ['music', 'beats', 'sounds', 'waves', 'notes', 'tunes'];
        return nouns[Math.floor(Math.random() * nouns.length)];
    };

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: colors.primary, opacity: 0.1 }} />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center">
                    {/* Badge */}
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 animate-pulse"
                        style={{ backgroundColor: `${colors.primary}15`, border: `1px solid ${colors.primary}30` }}
                    >
                        <Sparkles size={14} style={{ color: colors.primary }} />
                        <span className="text-sm font-semibold" style={{ color: colors.primary }}>
                            Limited Time Offer
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: colors.text.primary }}>
                        Start watching with{' '}
                        <span className="bg-clip-text text-transparent" style={{ color: colors.primary }}>
                            friends today
                        </span>
                    </h2>

                    <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
                        Create a room in seconds. No account required. Free forever.
                    </p>

                    {/* CTA Button */}
                    <div className="flex flex-col items-center gap-4">
                        <Button
                            variant="primary"
                            onClick={handleCreateRoom}
                            className="inline-flex items-center justify-center gap-2 px-10 h-14 text-xl rounded-2xl shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`,
                            }}
                        >
                            <Plus size={22} />
                            <span>Create Your First Room</span>
                        </Button>

                        {/* Alternative Action */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm" style={{ color: colors.text.muted }}>Already have a room code?</span>
                            <button
                                onClick={() => router.push('/join')}
                                className="text-sm font-medium transition-colors hover:underline"
                                style={{ color: colors.primary }}
                            >
                                Join Now
                                <ArrowRight size={14} className="inline ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* Feature Icons Row */}
                    <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t" style={{ borderColor: `${colors.text.muted}20` }}>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}10` }}>
                                <Video size={14} style={{ color: colors.primary }} />
                            </div>
                            <span className="text-sm" style={{ color: colors.text.muted }}>YouTube + Local</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}10` }}>
                                <Users size={14} style={{ color: colors.primary }} />
                            </div>
                            <span className="text-sm" style={{ color: colors.text.muted }}>Up to 3 viewers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}10` }}>
                                <MessageCircle size={14} style={{ color: colors.primary }} />
                            </div>
                            <span className="text-sm" style={{ color: colors.text.muted }}>Real-time chat</span>
                        </div>
                    </div>

                    {/* Trust Signal */}
                    <div className="mt-8">
                        <p className="text-xs" style={{ color: colors.text.muted }}>
                            Trusted by 5,000+ users • No credit card required
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};