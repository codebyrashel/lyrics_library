interface ChatLoadingProps {
  colors: any;
}

export const ChatLoading = ({ colors }: ChatLoadingProps) => {
  return (
    <div 
      className="flex flex-col h-full rounded-xl"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div className="p-3 border-b" style={{ borderColor: `${colors.text.muted}20` }}>
        <h3 className="font-semibold" style={{ color: colors.text.primary }}>Chat</h3>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent" style={{ borderColor: colors.primary }} />
      </div>
      <div className="p-3 border-t" style={{ borderColor: `${colors.text.muted}20` }}>
        <div className="flex gap-2">
          <div className="flex-1 h-10 rounded-lg" style={{ backgroundColor: colors.background }} />
          <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: colors.primary, opacity: 0.5 }} />
        </div>
      </div>
    </div>
  );
};