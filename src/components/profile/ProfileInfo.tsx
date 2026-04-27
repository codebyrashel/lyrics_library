'use client';

import { User, Mail, Calendar, Globe } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface ProfileInfoProps {
  name: string;
  email: string;
  username: string;
  memberSince: string;
  location?: string;
  bio?: string;
}

export const ProfileInfo = ({ name, email, username, memberSince, location, bio }: ProfileInfoProps) => {
  const colors = getColors();
  
  const infoItems = [
    { icon: User, label: 'Name', value: name },
    { icon: Mail, label: 'Email', value: email },
    { icon: Calendar, label: 'Member Since', value: memberSince },
    { icon: Globe, label: 'Location', value: location || 'Not specified' },
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
        Profile Information
      </h2>
      
      <div className="space-y-4">
        {infoItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3">
              <Icon size={18} style={{ color: colors.text.muted }} className="mt-0.5" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide" style={{ color: colors.text.muted }}>
                  {item.label}
                </p>
                <p className="font-medium" style={{ color: colors.text.primary }}>
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
        
        {bio && (
          <div className="flex items-start gap-3">
            <div className="w-4.5" />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide" style={{ color: colors.text.muted }}>
                Bio
              </p>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {bio}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};