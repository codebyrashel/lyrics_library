interface PlaylistLoadingProps {
  colors: any;
}

export const PlaylistLoading = ({ colors }: PlaylistLoadingProps) => {
  return (
    <div 
      className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="p-3 border-b" style={{ borderColor: `${colors.text.muted}20` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold" style={{ color: colors.text.primary }}>Watchlist</h3>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent" style={{ borderColor: colors.primary }} />
      </div>
    </div>
  );
};