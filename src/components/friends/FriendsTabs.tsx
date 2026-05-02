import { Users, UserPlus } from 'lucide-react';

interface FriendsTabsProps {
  activeTab: 'friends' | 'requests';
  onTabChange: (tab: 'friends' | 'requests') => void;
  friendsCount: number;
  requestsCount: number;
  colors: any;
}

export function FriendsTabs({ activeTab, onTabChange, friendsCount, requestsCount, colors }: FriendsTabsProps) {
  const tabs = [
    { id: 'friends', label: 'Friends', icon: Users, count: friendsCount },
    { id: 'requests', label: 'Requests', icon: UserPlus, count: requestsCount },
  ];

  return (
    <div className="flex gap-2 mb-6 border-b pb-2" style={{ borderColor: `${colors.text.muted}20` }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as typeof activeTab)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: isActive ? `${colors.primary}10` : 'transparent',
              color: isActive ? colors.primary : colors.text.secondary
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
}