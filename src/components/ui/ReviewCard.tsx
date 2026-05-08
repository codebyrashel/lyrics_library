'use client';

import { Star } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import Image from 'next/image';

interface ReviewCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export const ReviewCard = ({ name, role, content, rating, avatar }: ReviewCardProps) => {
  const colors = getColors();
  
  const avatarUrl = avatar || `https://ui-avatars.com/api/?background=${colors.primary.replace('#', '')}&color=fff&rounded=true&bold=true&size=80&name=${name.replace(' ', '+')}`;
  
  return (
    <div 
      className="p-6 rounded-xl transition-colors cursor-pointer"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${colors.text.muted}5`;
        e.currentTarget.style.borderColor = `${colors.primary}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.surface;
        e.currentTarget.style.borderColor = colors.surface;
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
        "{content}"
      </p>
      
      {/* User Info with Avatar */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <Image
          src={avatarUrl}
          alt={name}
          width={100}
          height={100}
          className="w-10 h-10 rounded-full object-cover"
          style={{ border: `2px solid ${colors.primary}` }}
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?background=${colors.primary.replace('#', '')}&color=fff&rounded=true&bold=true&size=80&name=${name.replace(' ', '+')}`;
          }}
        />
        
        {/* Name and Role */}
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