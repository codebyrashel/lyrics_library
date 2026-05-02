import { FriendCard } from './FriendCard';

interface FriendsListProps {
  friends: any[];
  onRemoveFriend: (friendId: string) => void;
  colors: any;
}

export function FriendsList({ friends, onRemoveFriend, colors }: FriendsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {friends.map((friend) => (
        <FriendCard
          key={friend.id}
          {...friend}
          onMessage={() => console.log('Message:', friend.name)}
          onInvite={() => console.log('Invite:', friend.name)}
          onRemove={() => onRemoveFriend(friend.id)}
        />
      ))}
    </div>
  );
}