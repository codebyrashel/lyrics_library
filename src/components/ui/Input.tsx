'use client';

import { getColors } from '@/store/colorStore';

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}

export const Input = ({ type, placeholder, value, onChange, icon }: InputProps) => {
  const colors = getColors();
  
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
          icon ? 'pl-10' : ''
        }`}
        style={{
          backgroundColor: colors.background,
          borderColor: `${colors.text.muted}30`,
          color: colors.text.primary
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.primary;
          e.target.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = `${colors.text.muted}30`;
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};