'use client';

import { Lightbulb } from 'lucide-react';
import { getColors } from '@/store/colorStore';

export const TipsSection = () => {
  const colors = getColors();
  
  return (
    <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb size={18} style={{ color: colors.primary }} />
        <h4 className="font-semibold" style={{ color: colors.text.primary }}>
          Tips
        </h4>
      </div>
      <div className="space-y-1 text-sm" style={{ color: colors.text.muted }}>
        <p>• Active rooms show a green &quot;Live&quot; badge and participant count</p>
        <p>• Rooms you created show a &quot;Host&quot; badge</p>
        <p>• Popular rooms with 5+ participants get a &quot;Popular&quot; badge</p>
        <p>• Click any room to join or rejoin</p>
      </div>
    </div>
  );
};