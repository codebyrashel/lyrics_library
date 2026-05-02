'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { AvatarUploadModal } from '@/components/profile/AvatarUploadModal';
import { Settings, Edit2, Bell, Lock, LogOut, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import Image from 'next/image';

interface UserProfile {
  name: string;
  email: string;
  username: string;
  memberSince: string;
  location: string;
  bio: string;
  avatar?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const colors = getColors();

  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    username: '',
    memberSince: '',
    location: '',
    bio: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlays: 0,
    friendsCount: 0,
    watchTime: 0,
    likedSongs: 0
  });

  // Load profile from backend when user is available
  useEffect(() => {
    if (user) {
      const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'January 2024';

      setProfile({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        memberSince: memberSince,
        location: '',
        bio: '',
      });

      if (user.avatar) {
        setAvatarUrl(user.avatar);
      }

      setIsLoading(false);

      const savedStats = localStorage.getItem('lyrics_library_stats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } else if (!isLoading) {
      router.push('/login');
    }
  }, [user, router]);

  const handleUpdateProfile = async (updatedData: { name: string; username: string; location: string; bio: string }) => {
    const response = await authService.updateProfile(updatedData);
    if (response.success) {
      // Refresh user data from backend
      await refreshUser();
      
      setProfile({
        ...profile,
        name: updatedData.name,
        username: updatedData.username,
        location: updatedData.location,
        bio: updatedData.bio,
      });
    }
  };

  const handleAvatarSave = async (blob: Blob) => {
    const response = await authService.uploadAvatar(blob);
    if (response.success && response.avatar) {
      setAvatarUrl(response.avatar);
      // Refresh user data to update avatar in context
      await refreshUser();
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const settingsOptions = [
    { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences', onClick: () => { } },
    { icon: Lock, label: 'Privacy', description: 'Control your privacy settings', onClick: () => { } },
    { icon: LogOut, label: 'Logout', description: 'Sign out of your account', danger: true, onClick: handleLogout },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: colors.primary }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.text.primary }}>
              Profile
            </h1>
            <p className="text-sm sm:text-base mt-1" style={{ color: colors.text.muted }}>
              Manage your account settings and preferences
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowEditModal(true)}>
            <Edit2 size={18} className="mr-2 inline-flex" />
            Edit Profile
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.surface}`
              }}
            >
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white cursor-pointer overflow-hidden"
                    style={{ backgroundColor: colors.primary }}
                    onClick={() => setShowAvatarModal(true)}
                  >
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Avatar"
                        className="object-cover"
                        width={100}
                        height={100}
                        unoptimized
                      />
                    ) : (
                      profile.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    style={{ color: colors.primary }}
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                    {profile.name}
                  </h2>
                  <p className="text-sm" style={{ color: colors.text.muted }}>
                    @{profile.username}
                  </p>
                  {profile.bio && (
                    <p className="text-sm mt-2" style={{ color: colors.text.secondary }}>
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <ProfileInfo
              name={profile.name}
              email={profile.email}
              username={profile.username}
              memberSince={profile.memberSince}
              location={profile.location}
              bio={profile.bio}
            />

            <ProfileStats
              totalPlays={stats.totalPlays}
              friendsCount={stats.friendsCount}
              watchTime={stats.watchTime}
              likedSongs={stats.likedSongs}
            />
          </div>

          <div className="space-y-6">
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.surface}`
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Settings size={20} style={{ color: colors.primary }} />
                <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
                  Settings
                </h2>
              </div>

              <div className="space-y-3">
                {settingsOptions.map((option, idx) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={idx}
                      onClick={option.onClick}
                      className="w-full p-3 rounded-lg text-left transition-all hover:scale-105"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.surface}`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} style={{ color: option.danger ? colors.status.error : colors.primary }} />
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: option.danger ? colors.status.error : colors.text.primary }}>
                            {option.label}
                          </p>
                          <p className="text-xs" style={{ color: colors.text.muted }}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="rounded-xl p-6 text-center"
              style={{
                backgroundColor: `${colors.status.success}10`,
                border: `1px solid ${colors.status.success}20`
              }}
            >
              <div className="text-sm font-semibold mb-1" style={{ color: colors.status.success }}>
                Account Active
              </div>
              <p className="text-xs" style={{ color: colors.text.muted }}>
                Your account is in good standing
              </p>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        userData={{
          name: profile.name,
          username: profile.username,
          location: profile.location,
          bio: profile.bio
        }}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdateProfile}
      />

      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSave={handleAvatarSave}
        currentAvatar={avatarUrl || undefined}
      />
    </DashboardLayout>
  );
}