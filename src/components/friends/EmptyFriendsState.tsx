import { User } from 'lucide-react';

interface EmptyFriendsStateProps {
  colors: any;
}

export function EmptyFriendsState({ colors }: EmptyFriendsStateProps) {
  return (
    <div className="text-center py-16 rounded-xl" style={{ backgroundColor: colors.surface }}>
      <User size={48} style={{ color: colors.text.muted }} className="mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
        No friends yet
      </h3>
      <p style={{ color: colors.text.muted }}>
        Add friends using their username to get started
      </p>
    </div>
  );
}