'use client';

import { useState, useEffect, useCallback } from 'react';
import { friendsService, Friend, FriendRequest } from '@/services/friends.service';
import { wsService } from '@/services/websocket.service';

export const useFriendsData = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Load friends from API
  const loadFriends = useCallback(async () => {
    const response = await friendsService.getFriends();
    if (response.success && response.friends) {
      setFriends(response.friends);
    }
  }, []);

  // Load friend requests from API
  const loadRequests = useCallback(async () => {
    const response = await friendsService.getFriendRequests();
    if (response.success && response.requests) {
      setFriendRequests(response.requests);
    }
  }, []);

  // Load both friends and requests
  const loadAllData = useCallback(async () => {
    setIsInitialLoading(true);
    await Promise.all([loadFriends(), loadRequests()]);
    setIsInitialLoading(false);
  }, [loadFriends, loadRequests]);

  // Show temporary notification message
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Send a friend request to a user by username
  const sendFriendRequest = async (username: string) => {
    setIsLoading(true);
    const response = await friendsService.sendFriendRequest(username);
    if (response.success) {
      showMessage('success', `Friend request sent to @${username}`);
      await loadRequests();
    } else {
      showMessage('error', response.message || 'Failed to send request');
    }
    setIsLoading(false);
  };

  // Accept a pending friend request
  const acceptRequest = async (requestId: string) => {
    setIsLoading(true);
    const response = await friendsService.acceptRequest(requestId);
    if (response.success) {
      showMessage('success', 'Friend request accepted');
      // Remove from requests list immediately
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      // Refresh friends list
      await loadFriends();
    } else {
      showMessage('error', response.message || 'Failed to accept request');
    }
    setIsLoading(false);
  };

  // Reject a pending friend request
  const rejectRequest = async (requestId: string) => {
    setIsLoading(true);
    const response = await friendsService.rejectRequest(requestId);
    if (response.success) {
      showMessage('success', 'Friend request rejected');
      // Remove from requests list immediately
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    } else {
      showMessage('error', response.message || 'Failed to reject request');
    }
    setIsLoading(false);
  };

  // Remove an existing friend
  const removeFriend = async (friendId: string) => {
    setIsLoading(true);
    const response = await friendsService.removeFriend(friendId);
    if (response.success) {
      showMessage('success', 'Friend removed');
      // Remove from friends list immediately
      setFriends(prev => prev.filter(f => f.id !== friendId));
    } else {
      showMessage('error', response.message || 'Failed to remove friend');
    }
    setIsLoading(false);
  };

  // WebSocket listeners for real-time updates
  useEffect(() => {
    // Handle incoming friend request
    const handleFriendRequestReceived = (data: any) => {
      showMessage('success', `New friend request from ${data.senderName || 'someone'}`);
      loadRequests();
    };

    // Handle friend request accepted
    const handleFriendRequestAccepted = (data: any) => {
      showMessage('success', `${data.friendName || 'Someone'} accepted your friend request`);
      // Remove from requests if present
      setFriendRequests(prev => prev.filter(req => req.id !== data.requestId));
      // Refresh friends list
      loadFriends();
    };

    // Handle friend removed
    const handleFriendRemoved = (data: any) => {
      // Remove the removed friend from local state
      setFriends(prev => prev.filter(f => f.id !== data.friendId));
    };

    // Handle friend request rejected
    const handleFriendRequestRejected = (data: any) => {
      showMessage('info', 'Friend request was rejected');
      // Remove the rejected request from local state
      setFriendRequests(prev => prev.filter(req => req.id !== data.requestId));
    };

    wsService.on('friend_request_received', handleFriendRequestReceived);
    wsService.on('friend_request_accepted', handleFriendRequestAccepted);
    wsService.on('friend_removed', handleFriendRemoved);
    wsService.on('friend_request_rejected', handleFriendRequestRejected);

    return () => {
      wsService.off('friend_request_received', handleFriendRequestReceived);
      wsService.off('friend_request_accepted', handleFriendRequestAccepted);
      wsService.off('friend_removed', handleFriendRemoved);
      wsService.off('friend_request_rejected', handleFriendRequestRejected);
    };
  }, [loadFriends, loadRequests]);

  // Initial load on mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

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