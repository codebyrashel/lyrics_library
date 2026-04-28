'use client';

import { useState } from 'react';
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
  DoorOpen
} from 'lucide-react';
import { getColors } from '@/store/colorStore';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', exact: true },
  { name: 'Rooms', icon: DoorOpen, href: '/dashboard/rooms', exact: false },
  { name: 'Library', icon: Library, href: '/dashboard/library', exact: false },
  { name: 'Friends', icon: Users, href: '/dashboard/friends', exact: false },
  { name: 'Profile', icon: User, href: '/dashboard/profile', exact: false },
];

export const DashboardSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const colors = getColors();
  
  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname?.startsWith(item.href);
  };
  
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: `${colors.text.muted}20` }}>
        <div className="flex items-center gap-2">
          <Music2 size={24} style={{ color: colors.primary }} />
          <span className="font-bold text-lg" style={{ color: colors.text.primary }}>
            Lyrics Library
          </span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: active ? `${colors.primary}10` : 'transparent',
                color: active ? colors.primary : colors.text.secondary
              }}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
  
  return (
    <>
      {/* Mobile Menu Button */}
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
      
      {/* Desktop Sidebar */}
      <aside 
        className="hidden lg:flex lg:w-64 flex-col fixed lg:relative z-40 h-full"
        style={{ 
          backgroundColor: colors.surface,
          borderRight: `1px solid ${colors.surface}`
        }}
      >
        <SidebarContent />
      </aside>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
      )}
      
      {/* Mobile Sidebar */}
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