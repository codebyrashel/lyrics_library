'use client';

import { Lock, UserPlus } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ChatBlockerProps {
    roomId: string;
}

export const ChatBlocker = ({ roomId }: ChatBlockerProps) => {
    const router = useRouter();
    const colors = getColors();

    const handleSignUp = () => {
        localStorage.setItem('redirect_after_auth', `/room/${roomId}`);
        router.push('/register');
    };

    const handleLogin = () => {
        localStorage.setItem('redirect_after_auth', `/room/${roomId}`);
        router.push('/login');
    };

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-20 p-6 text-center">
            <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${colors.primary}15` }}
            >
                <Lock size={32} style={{ color: colors.primary }} />
            </div>

            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
                Chat is locked
            </h3>

            <p className="text-sm mb-4 max-w-xs" style={{ color: colors.text.muted }}>
                Create a free account to join the conversation and unlock all features
            </p>

            <div className="flex items-center gap-3">
                <Button
                    variant="primary"
                    onClick={handleSignUp}
                    className="flex items-center justify-center"
                >
                    <UserPlus size={16} className="mr-2" />
                    Sign Up Free
                </Button>

                <Button
                    variant="outline"
                    onClick={handleLogin}
                    className="flex items-center justify-center"
                >
                    Login
                </Button>
            </div>

            <p className="text-xs mt-4" style={{ color: colors.text.muted }}>
                No credit card required • Free forever
            </p>
        </div>
    );
};