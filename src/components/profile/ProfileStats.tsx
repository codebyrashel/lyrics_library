'use client';

import { Music, Users, Clock, Heart } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface ProfileStatsProps {
  totalPlays: number;
  friendsCount: number;
  watchTime: number;
  likedSongs: number;
}

export const ProfileStats = ({ totalPlays, friendsCount, watchTime, likedSongs }: ProfileStatsProps) => {
  const colors = getColors();
  
  const stats = [
    { icon: Music, label: 'Total Plays', value: totalPlays },
    { icon: Users, label: 'Friends', value: friendsCount },
    { icon: Clock, label: 'Watch Time', value: `${watchTime} hrs` },
    { icon: Heart, label: 'Liked Songs', value: likedSongs },
  ];
  
  return (
    <div 
      className="rounded-xl p-6"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>
        Statistics
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="text-center p-3 rounded-lg" style={{ backgroundColor: colors.background }}>
              <Icon size={20} style={{ color: colors.primary }} className="mx-auto mb-2" />
              <div className="text-xl font-bold" style={{ color: colors.text.primary }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: colors.text.muted }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};