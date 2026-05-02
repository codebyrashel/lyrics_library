interface FriendsHeaderProps {
  colors: any;
}

export function FriendsHeader({ colors }: FriendsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.text.primary }}>
        Friends
      </h1>
      <p className="text-sm sm:text-base mt-1" style={{ color: colors.text.muted }}>
        Connect with friends and watch together
      </p>
    </div>
  );
}