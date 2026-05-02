import { UserPlus } from 'lucide-react';

interface EmptyRequestsStateProps {
  colors: any;
}

export function EmptyRequestsState({ colors }: EmptyRequestsStateProps) {
  return (
    <div className="text-center py-16 rounded-xl" style={{ backgroundColor: colors.surface }}>
      <UserPlus size={48} style={{ color: colors.text.muted }} className="mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
        No friend requests
      </h3>
      <p style={{ color: colors.text.muted }}>
        When someone sends you a request, it will appear here
      </p>
    </div>
  );
}