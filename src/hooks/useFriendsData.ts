import { useState, useEffect } from 'react';

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

export function useFriendsData() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    
    setTimeout(() => {
      if (friends.some(f => f.username === username)) {
        setMessage({ type: 'error', text: 'Already friends with this user!' });
        setIsLoading(false);
        return;
      }
      
      if (friendRequests.some(r => r.username === username)) {
        setMessage({ type: 'error', text: 'Friend request already sent!' });
        setIsLoading(false);
        return;
      }
      
      const newRequest = {
        id: Date.now().toString(),
        name: username,
        username: username,
      };
      setFriendRequests([...friendRequests, newRequest]);
      setMessage({ type: 'success', text: `Friend request sent to @${username}!` });
      setIsLoading(false);
      
      setTimeout(() => setMessage(null), 3000);
    }, 500);
  };

  const acceptRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      const newFriend: Friend = {
        id: request.id,
        name: request.name,
        username: request.username,
        status: 'offline',
      };
      setFriends([...friends, newFriend]);
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

  return {
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
  };
}