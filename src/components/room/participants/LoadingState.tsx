import { Users } from 'lucide-react';

interface LoadingStateProps {
  colors: any;
}

export const LoadingState = ({ colors }: LoadingStateProps) => {
  return (
    <div
      className="flex flex-col h-128 rounded-xl overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="p-3 border-b" style={{ borderColor: `${colors.text.muted}20` }}>
        <div className="flex items-center gap-2">
          <Users size={16} style={{ color: colors.primary }} />
          <h3 className="font-semibold" style={{ color: colors.text.primary }}>
            Participants
          </h3>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent" style={{ borderColor: colors.primary }} />
      </div>
    </div>
  );
};