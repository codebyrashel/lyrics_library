'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Library, 
  Users, 
  User,
  Music2,
  Menu,
  X,
  DoorOpen,
  MessageCircle
} from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { messageService } from '@/services/message.service';
import { wsService } from '@/services/websocket.service';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', exact: true },
  { name: 'Rooms', icon: DoorOpen, href: '/dashboard/rooms', exact: false },
  { name: 'Library', icon: Library, href: '/dashboard/library', exact: false },
  { name: 'Friends', icon: Users, href: '/dashboard/friends', exact: false },
  { name: 'Messages', icon: MessageCircle, href: '/dashboard/messages', exact: false },
  { name: 'Profile', icon: User, href: '/dashboard/profile', exact: false },
];

export const DashboardSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const pathname = usePathname();
  const colors = getColors();

  const loadTotalUnreadCount = async () => {
    const response = await messageService.getConversations();
    if (response.success && response.conversations) {
      const total = response.conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
      setTotalUnreadCount(total);
    }
  };

  // Listen for real-time updates
  useEffect(() => {
    loadTotalUnreadCount();

    const handleMessageUpdate = () => {
      loadTotalUnreadCount();
    };

    wsService.on('new_message', handleMessageUpdate);
    wsService.on('friend_request_received', handleMessageUpdate);
    wsService.on('friend_request_accepted', handleMessageUpdate);

    return () => {
      wsService.off('new_message', handleMessageUpdate);
      wsService.off('friend_request_received', handleMessageUpdate);
      wsService.off('friend_request_accepted', handleMessageUpdate);
    };
  }, []);
  
  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname?.startsWith(item.href);
  };
  
  const SidebarContent = () => (
    <>
      <div className="p-6 border-b" style={{ borderColor: `${colors.text.muted}20` }}>
        <div className="flex items-center gap-2">
          <Music2 size={24} style={{ color: colors.primary }} />
          <span className="font-bold text-lg" style={{ color: colors.text.primary }}>
            Lyrics Library
          </span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const showUnreadBadge = item.name === 'Messages' && totalUnreadCount > 0;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: active ? `${colors.primary}10` : 'transparent',
                color: active ? colors.primary : colors.text.secondary
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = `${colors.text.muted}10`;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </div>
              {showUnreadBadge && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                  style={{ backgroundColor: colors.status.error }}
                >
                  {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
  
  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden"
        style={{ 
          backgroundColor: colors.surface,
          color: colors.text.primary,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <aside 
        className="hidden lg:flex lg:w-64 flex-col fixed lg:relative z-40 h-full"
        style={{ 
          backgroundColor: colors.surface,
          borderRight: `1px solid ${colors.surface}`
        }}
      >
        <SidebarContent />
      </aside>
      
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
      )}
      
      <aside 
        className={`fixed top-0 left-0 h-full w-64 z-40 transform transition-transform duration-300 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          backgroundColor: colors.surface,
          borderRight: `1px solid ${colors.surface}`
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
};