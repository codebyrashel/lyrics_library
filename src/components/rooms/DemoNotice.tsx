'use client';

import { Info } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface DemoNoticeProps {
  onToggle: () => void;
  showDummyData: boolean;
}

export const DemoNotice = ({ onToggle, showDummyData }: DemoNoticeProps) => {
  const colors = getColors();
  
  if (!showDummyData) return null;
  
  return (
    <div 
      className="mb-6 p-3 rounded-lg text-sm flex items-center justify-between"
      style={{ 
        backgroundColor: `${colors.primary}10`,
        border: `1px solid ${colors.primary}20`
      }}
    >
      <div className="flex items-center gap-2">
        <Info size={16} style={{ color: colors.primary }} />
        <span style={{ color: colors.primary }}>
          Demo mode: Showing sample rooms. Create your own room to see it here!
        </span>
      </div>
      <button
        onClick={onToggle}
        className="px-2 py-1 rounded text-xs transition-colors"
        style={{ color: colors.primary }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${colors.primary}15`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        Show My Rooms
      </button>
    </div>
  );
};