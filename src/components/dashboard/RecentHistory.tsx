'use client';

import Link from 'next/link';
import { History, ArrowRight } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { HistoryItem } from './HistoryItem';

interface RecentHistoryProps {
  historyItems: any[];
}

export const RecentHistory = ({ historyItems }: RecentHistoryProps) => {
  const colors = getColors();
  const recentItems = historyItems.slice(0, 5);
  
  if (recentItems.length === 0) {
    return null;
  }
  
  return (
    <div 
      className="rounded-xl p-6"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <History size={18} style={{ color: colors.primary }} />
          <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>
            Recently Played
          </h2>
        </div>
        <Link 
          href="/dashboard/history" 
          className="text-sm hover:underline flex items-center gap-1 transition-all"
          style={{ color: colors.primary }}
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {recentItems.map((item, idx) => (
          <HistoryItem key={idx} {...item} />
        ))}
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${colors.text.muted}10;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.text.muted}30;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};