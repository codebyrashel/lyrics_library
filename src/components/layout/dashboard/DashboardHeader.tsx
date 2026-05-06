'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Bell, User, LogOut, ChevronDown, Circle, Clock, MinusCircle, EyeOff } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useAuth } from '@/contexts/AuthContext';
import { StatusModal } from '@/components/profile/StatusModal';
import { UserStatus, statusConfig } from '@/types/status';
import { statusService } from '@/services/status.service';
import { wsService } from '@/services/websocket.service';

export const DashboardHeader = () => {
  const colors = getColors();
  const { user, logout } = useAuth();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus>('online');
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const hasLoadedStatus = useRef(false);
  
  const userName = user?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  const userAvatar = user?.avatar || null;

  // Load user's saved status from backend - only once
  useEffect(() => {
    if (hasLoadedStatus.current) return;
    hasLoadedStatus.current = true;
    
    const loadUserStatus = async () => {
      const response = await statusService.getStatus();
      if (response.success && response.status) {
        setUserStatus(response.status as UserStatus);
      }
      setIsLoadingStatus(false);
    };
    
    loadUserStatus();
  }, []);

  // Listen for status changes from WebSocket
  useEffect(() => {
    const handleStatusChange = (data: any) => {
      if (data.userId === user?.id) {
        setUserStatus(data.status as UserStatus);
      }
    };

    wsService.on('status_changed', handleStatusChange);
    
    return () => {
      wsService.off('status_changed', handleStatusChange);
    };
  }, [user?.id]);

  const getStatusIcon = () => {
    switch (userStatus) {
      case 'online': return <Circle size={12} fill={statusConfig.online.color} stroke={statusConfig.online.color} />;
      case 'idle': return <Clock size={12} style={{ color: statusConfig.idle.color }} />;
      case 'dnd': return <MinusCircle size={12} style={{ color: statusConfig.dnd.color }} />;
      case 'invisible': return <EyeOff size={12} style={{ color: statusConfig.invisible.color }} />;
    }
  };

  const handleStatusChange = (newStatus: UserStatus) => {
    setUserStatus(newStatus);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header 
        className="h-16 flex items-center justify-between px-4 sm:px-6 border-b ml-12 lg:ml-0"
        style={{ 
          backgroundColor: colors.background,
          borderColor: `${colors.text.muted}20`
        }}
      >
        <div>
          <h2 className="text-base sm:text-xl font-semibold truncate" style={{ color: colors.text.primary }}>
            Welcome back, {userName}
          </h2>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button 
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ color: colors.text.secondary }}
          >
            <Bell size={18} className="sm:w-5 sm:h-5" />
          </button>
          
          {/* User Menu with Status */}
          <div className="relative">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-sm overflow-hidden cursor-pointer"
                  style={{ backgroundColor: colors.primary }}
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                >
                  {userAvatar ? (
                    <Image 
                      src={userAvatar} 
                      alt={userName} 
                      width={32}
                      height={32}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </div>
                {/* Status indicator */}
                {!isLoadingStatus && (
                  <div 
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ 
                      backgroundColor: statusConfig[userStatus].color,
                      borderColor: colors.background
                    }}
                  />
                )}
              </div>
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="p-1 rounded-lg transition-all hover:scale-105"
                style={{ color: colors.text.secondary }}
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Status Dropdown Menu */}
            {showStatusMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowStatusMenu(false)}
                />
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50 overflow-hidden"
                  style={{ backgroundColor: colors.surface, border: `1px solid ${colors.text.muted}20` }}
                >
                  <button
                    onClick={() => {
                      setShowStatusMenu(false);
                      setShowStatusModal(true);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-opacity-10 flex items-center gap-2"
                    style={{ color: colors.text.primary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.text.muted}10`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {getStatusIcon()}
                    <span>Set Status</span>
                  </button>
                  <div className="border-t" style={{ borderColor: `${colors.text.muted}20` }} />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-opacity-10 flex items-center gap-2"
                    style={{ color: colors.status.error }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.text.muted}10`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={userStatus}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};