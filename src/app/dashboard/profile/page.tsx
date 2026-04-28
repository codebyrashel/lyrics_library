'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { Settings, Edit2, Bell, Lock, LogOut } from 'lucide-react';

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
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    memberSince: 'January 2024',
    location: 'New York, USA',
    bio: 'Music lover and movie enthusiast. Always looking for new songs to discover!'
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState({
    totalPlays: 47,
    friendsCount: 8,
    watchTime: 128,
    likedSongs: 34
  });
  const colors = getColors();

  // Load profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('lyrics_library_profile');
    const savedStats = localStorage.getItem('lyrics_library_stats');
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      localStorage.setItem('lyrics_library_profile', JSON.stringify(profile));
    }
    
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      localStorage.setItem('lyrics_library_stats', JSON.stringify(stats));
    }
  }, []);

  // Save profile when updated
  useEffect(() => {
    if (profile.name !== 'John Doe') {
      localStorage.setItem('lyrics_library_profile', JSON.stringify(profile));
    }
  }, [profile]);

  const handleUpdateProfile = (updatedData: { name: string; username: string; location: string; bio: string }) => {
    setProfile({
      ...profile,
      name: updatedData.name,
      username: updatedData.username,
      location: updatedData.location,
      bio: updatedData.bio
    });
  };

  const settingsOptions = [
    { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences' },
    { icon: Lock, label: 'Privacy', description: 'Control your privacy settings' },
    { icon: LogOut, label: 'Logout', description: 'Sign out of your account', danger: true },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card with Avatar */}
            <div 
              className="rounded-xl p-6"
              style={{ 
                backgroundColor: colors.surface,
                border: `1px solid ${colors.surface}`
              }}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  {profile.name.charAt(0).toUpperCase()}
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
          
          {/* Right Column - Settings */}
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
            
            {/* Account Status */}
            <div 
              className="rounded-xl p-6 text-center"
              style={{ 
                backgroundColor: `${colors.status.success}10`,
                border: `1px solid ${colors.status.success}20`
              }}
            >
              <div className="text-sm font-semibold mb-1" style={{ color: colors.status.success }}>
                ✓ Account Active
              </div>
              <p className="text-xs" style={{ color: colors.text.muted }}>
                Your account is in good standing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
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
    </DashboardLayout>
  );
}