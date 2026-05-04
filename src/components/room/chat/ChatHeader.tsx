interface ChatHeaderProps {
  colors: any;
}

export const ChatHeader = ({ colors }: ChatHeaderProps) => {
  return (
    <div className="p-3 border-b" style={{ borderColor: `${colors.text.muted}20` }}>
      <h3 className="font-semibold" style={{ color: colors.text.primary }}>Chat</h3>
    </div>
  );
};