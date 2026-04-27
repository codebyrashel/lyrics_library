'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface ReviewCardProps {
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar: string;
}

export const ReviewCard = ({ name, role, content, rating, avatar }: ReviewCardProps) => {
    const colors = getColors();

    return (
        <div
            className="p-6 rounded-lg transition-all duration-300 hover:scale-105"
            style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.surface}`
            }}
        >
            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        fill={i < rating ? colors.primary : 'none'}
                        style={{ color: colors.primary }}
                    />
                ))}
            </div>

            {/* Review Content */}
            <p
                className="mb-4 italic"
                style={{ color: colors.text.secondary }}
            >
                &quot;{content}&quot;
            </p>

            {/* User Info */}
            <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                        src={avatar}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div>
                    <h4
                        className="font-semibold"
                        style={{ color: colors.text.primary }}
                    >
                        {name}
                    </h4>
                    <p
                        className="text-sm"
                        style={{ color: colors.text.muted }}
                    >
                        {role}
                    </p>
                </div>
            </div>
        </div>
    );
};