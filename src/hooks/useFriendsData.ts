'use client';

import { useState, useEffect, useCallback } from 'react';
import { friendsService, Friend, FriendRequest } from '@/services/friends.service';

export const useFriendsData = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Load friends and requests on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsInitialLoading(true);
    await Promise.all([loadFriends(), loadRequests()]);
    setIsInitialLoading(false);
  };

  const loadFriends = async () => {
    const response = await friendsService.getFriends();
    if (response.success && response.friends) {
      setFriends(response.friends);
    }
  };

  const loadRequests = async () => {
    const response = await friendsService.getFriendRequests();
    if (response.success && response.requests) {
      setFriendRequests(response.requests);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const sendFriendRequest = async (username: string) => {
    setIsLoading(true);
    const response = await friendsService.sendFriendRequest(username);
    if (response.success) {
      showMessage('success', `Friend request sent to @${username}`);
      await loadRequests(); // Refresh requests (outgoing)
    } else {
      showMessage('error', response.message || 'Failed to send request');
    }
    setIsLoading(false);
  };

  const acceptRequest = async (requestId: string) => {
    setIsLoading(true);
    const response = await friendsService.acceptRequest(requestId);
    if (response.success) {
      showMessage('success', 'Friend request accepted');
      await Promise.all([loadFriends(), loadRequests()]);
    } else {
      showMessage('error', response.message || 'Failed to accept request');
    }
    setIsLoading(false);
  };

  const rejectRequest = async (requestId: string) => {
    setIsLoading(true);
    const response = await friendsService.rejectRequest(requestId);
    if (response.success) {
      showMessage('success', 'Friend request rejected');
      await loadRequests();
    } else {
      showMessage('error', response.message || 'Failed to reject request');
    }
    setIsLoading(false);
  };

  const removeFriend = async (friendId: string) => {
    setIsLoading(true);
    const response = await friendsService.removeFriend(friendId);
    if (response.success) {
      showMessage('success', 'Friend removed');
      await loadFriends();
    } else {
      showMessage('error', response.message || 'Failed to remove friend');
    }
    setIsLoading(false);
  };

  // Subscribe to WebSocket events for real-time updates
  useEffect(() => {
    // This will be expanded when WebSocket events are added
    // For now, we just poll when tab changes
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadFriends();
        loadRequests();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    friends,
    friendRequests,
    activeTab,
    setActiveTab,
    isLoading: isInitialLoading || isLoading,
    message,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    refreshData: loadAllData,
  };
};