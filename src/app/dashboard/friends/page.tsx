'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import { getColors } from '@/store/colorStore';
import { FriendRequestCard } from '@/components/friends/FriendRequestCard';
import { FriendCard } from '@/components/friends/FriendCard';
import { AddFriendCard } from '@/components/friends/AddFriendCard';
import { User, Users, UserPlus, AlertCircle } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  username: string;
  status: 'online' | 'offline' | 'away';
  avatar?: string;
}

interface FriendRequest {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const colors = getColors();

  // Load friends from localStorage
  useEffect(() => {
    const savedFriends = localStorage.getItem('lyrics_library_friends');
    const savedRequests = localStorage.getItem('lyrics_library_friend_requests');
    
    if (savedFriends) {
      setFriends(JSON.parse(savedFriends));
    } else {
      const defaultFriends = [
        { id: '1', name: 'Sarah Johnson', username: 'sarah_j', status: 'online' as const },
        { id: '2', name: 'Michael Chen', username: 'mike_chen', status: 'offline' as const },
        { id: '3', name: 'Emma Rodriguez', username: 'emma_r', status: 'away' as const },
      ];
      setFriends(defaultFriends);
      localStorage.setItem('lyrics_library_friends', JSON.stringify(defaultFriends));
    }
    
    if (savedRequests) {
      setFriendRequests(JSON.parse(savedRequests));
    } else {
      const defaultRequests = [
        { id: 'req1', name: 'David Kim', username: 'david_kim' },
        { id: 'req2', name: 'Lisa Thompson', username: 'lisa_t' },
      ];
      setFriendRequests(defaultRequests);
      localStorage.setItem('lyrics_library_friend_requests', JSON.stringify(defaultRequests));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (friends.length > 0) {
      localStorage.setItem('lyrics_library_friends', JSON.stringify(friends));
    }
  }, [friends]);
  
  useEffect(() => {
    if (friendRequests.length > 0) {
      localStorage.setItem('lyrics_library_friend_requests', JSON.stringify(friendRequests));
    }
  }, [friendRequests]);

  const sendFriendRequest = (username: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Check if user exists (mock check)
      const existingUser = { id: `user_${Date.now()}`, name: username, username };
      
      // Check if already friends
      if (friends.some(f => f.username === username)) {
        setMessage({ type: 'error', text: 'Already friends with this user!' });
        setIsLoading(false);
        return;
      }
      
      // Check if request already sent
      if (friendRequests.some(r => r.username === username)) {
        setMessage({ type: 'error', text: 'Friend request already sent!' });
        setIsLoading(false);
        return;
      }
      
      // Add friend request
      const newRequest = {
        id: Date.now().toString(),
        name: username,
        username: username,
      };
      setFriendRequests([...friendRequests, newRequest]);
      setMessage({ type: 'success', text: `Friend request sent to @${username}!` });
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }, 500);
  };

  const acceptRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      // Add to friends
      const newFriend: Friend = {
        id: request.id,
        name: request.name,
        username: request.username,
        status: 'offline',
      };
      setFriends([...friends, newFriend]);
      // Remove from requests
      setFriendRequests(friendRequests.filter(r => r.id !== requestId));
      setMessage({ type: 'success', text: `You are now friends with ${request.name}!` });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const rejectRequest = (requestId: string) => {
    setFriendRequests(friendRequests.filter(r => r.id !== requestId));
    setMessage({ type: 'success', text: 'Friend request rejected' });
    setTimeout(() => setMessage(null), 3000);
  };

  const removeFriend = (friendId: string) => {
    setFriends(friends.filter(f => f.id !== friendId));
    setMessage({ type: 'success', text: 'Friend removed' });
    setTimeout(() => setMessage(null), 3000);
  };

  const tabs = [
    { id: 'friends', label: 'Friends', icon: Users, count: friends.length },
    { id: 'requests', label: 'Requests', icon: UserPlus, count: friendRequests.length },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.text.primary }}>
            Friends
          </h1>
          <p className="text-sm sm:text-base mt-1" style={{ color: colors.text.muted }}>
            Connect with friends and watch together
          </p>
        </div>

        {/* Message */}
        {message && (
          <div 
            className="p-3 rounded-lg mb-6 flex items-center gap-2"
            style={{ 
              backgroundColor: message.type === 'success' ? `${colors.status.success}15` : `${colors.status.error}15`,
              border: `1px solid ${message.type === 'success' ? colors.status.success : colors.status.error}30`
            }}
          >
            <AlertCircle size={16} style={{ color: message.type === 'success' ? colors.status.success : colors.status.error }} />
            <p className="text-sm" style={{ color: message.type === 'success' ? colors.status.success : colors.status.error }}>
              {message.text}
            </p>
          </div>
        )}

        {/* Add Friend Card */}
        <div className="mb-8">
          <AddFriendCard onSendRequest={sendFriendRequest} isLoading={isLoading} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-2" style={{ borderColor: `${colors.text.muted}20` }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

        {/* Friends List */}
        {activeTab === 'friends' && (
          <>
            {friends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    {...friend}
                    onMessage={() => console.log('Message:', friend.name)}
                    onInvite={() => console.log('Invite:', friend.name)}
                    onRemove={() => removeFriend(friend.id)}
                  />
                ))}
              </div>
            ) : (
              <div 
                className="text-center py-16 rounded-xl"
                style={{ backgroundColor: colors.surface }}
              >
                <User size={48} style={{ color: colors.text.muted }} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
                  No friends yet
                </h3>
                <p style={{ color: colors.text.muted }}>
                  Add friends using their username to get started
                </p>
              </div>
            )}
          </>
        )}

        {/* Friend Requests List */}
        {activeTab === 'requests' && (
          <>
            {friendRequests.length > 0 ? (
              <div className="space-y-3">
                {friendRequests.map((request) => (
                  <FriendRequestCard
                    key={request.id}
                    {...request}
                    onAccept={() => acceptRequest(request.id)}
                    onReject={() => rejectRequest(request.id)}
                  />
                ))}
              </div>
            ) : (
              <div 
                className="text-center py-16 rounded-xl"
                style={{ backgroundColor: colors.surface }}
              >
                <UserPlus size={48} style={{ color: colors.text.muted }} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
                  No friend requests
                </h3>
                <p style={{ color: colors.text.muted }}>
                  When someone sends you a request, it will appear here
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}