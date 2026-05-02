'use client';

// import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import { getColors } from '@/store/colorStore';
import { FriendsHeader } from '@/components/friends/FriendsHeader';
import { FriendsTabs } from '@/components/friends/FriendsTabs';
import { FriendsList } from '@/components/friends/FriendsList';
import { FriendRequestsList } from '@/components/friends/FriendRequestsList';
import { EmptyFriendsState } from '@/components/friends/EmptyFriendsState';
import { EmptyRequestsState } from '@/components/friends/EmptyRequestsState';
import { useFriendsData } from '@/hooks/useFriendsData';
import { AddFriendCard } from '@/components/friends/AddFriendCard';
import { FriendsMessage } from '@/components/friends/FriendsMessage';

export default function FriendsPage() {
  const colors = getColors();
  const {
    friends,
    friendRequests,
    activeTab,
    setActiveTab,
    isLoading,
    message,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
  } = useFriendsData();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <FriendsHeader colors={colors} />
        
        {message && <FriendsMessage message={message} colors={colors} />}
        
        <AddFriendCard onSendRequest={sendFriendRequest} isLoading={isLoading} colors={colors} />
        
        <FriendsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          friendsCount={friends.length}
          requestsCount={friendRequests.length}
          colors={colors}
        />
        
        {activeTab === 'friends' && (
          friends.length > 0 
            ? <FriendsList friends={friends} onRemoveFriend={removeFriend} colors={colors} />
            : <EmptyFriendsState colors={colors} />
        )}
        
        {activeTab === 'requests' && (
          friendRequests.length > 0
            ? <FriendRequestsList requests={friendRequests} onAccept={acceptRequest} onReject={rejectRequest} colors={colors} />
            : <EmptyRequestsState colors={colors} />
        )}
      </div>
    </DashboardLayout>
  );
}