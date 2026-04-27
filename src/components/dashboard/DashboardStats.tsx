'use client';

import { Play, Clock, AlertCircle, Home } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface DashboardStatsProps {
  totalPlays: number;
  hoursListened: number;
  missingCount: number;
  roomsCreated: number;
}

export const DashboardStats = ({ totalPlays, hoursListened, missingCount, roomsCreated }: DashboardStatsProps) => {
  const colors = getColors();
  
  const stats = [
    { label: 'Total Plays', value: totalPlays, icon: Play },
    { label: 'Hours Listened', value: hoursListened, icon: Clock },
    { label: 'Missing Tracks', value: missingCount, icon: AlertCircle },
    { label: 'Rooms Created', value: roomsCreated, icon: Home },
  ];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-xl transition-all hover:scale-105"
            style={{ 
              backgroundColor: colors.surface,
              border: `1px solid ${colors.surface}`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon size={22} style={{ color: colors.primary }} />
              <span className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                {stat.value}
              </span>
            </div>
            <p className="text-sm" style={{ color: colors.text.muted }}>
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};