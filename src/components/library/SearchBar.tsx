'use client';

import { Search, X } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const SearchBar = ({ value, onChange, onClear }: SearchBarProps) => {
  const colors = getColors();
  
  return (
    <div className="relative max-w-md">
      <Search 
        size={18} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2"
        style={{ color: colors.text.muted }}
      />
      <input
        type="text"
        placeholder="Search playlists..."
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2"
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.surface}`,
          color: colors.text.primary
        }}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <X size={16} style={{ color: colors.text.muted }} />
        </button>
      )}
    </div>
  );
};