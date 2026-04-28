'use client';

import { DoorOpen, Users, Clock } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface RoomsTabsProps {
  activeTab: 'all' | 'active' | 'recent';
  onTabChange: (tab: 'all' | 'active' | 'recent') => void;
  counts: {
    all: number;
    active: number;
    recent: number;
  };
}

export const RoomsTabs = ({ activeTab, onTabChange, counts }: RoomsTabsProps) => {
  const colors = getColors();
  
  const tabs = [
    { id: 'all' as const, label: 'All Rooms', icon: DoorOpen, count: counts.all },
    { id: 'active' as const, label: 'Active', icon: Users, count: counts.active },
    { id: 'recent' as const, label: 'Recent', icon: Clock, count: counts.recent },
  ];
  
  return (
    <div className="flex gap-2 mb-6 border-b pb-2" style={{ borderColor: `${colors.text.muted}20` }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: isActive ? `${colors.primary}10` : 'transparent',
              color: isActive ? colors.primary : colors.text.secondary
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = `${colors.text.muted}10`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span 
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};