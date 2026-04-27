'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getColors } from '@/store/colorStore';

interface EditProfileModalProps {
  isOpen: boolean;
  userData: {
    name: string;
    username: string;
    location: string;
    bio: string;
  };
  onClose: () => void;
  onSave: (data: { name: string; username: string; location: string; bio: string }) => void;
}

export const EditProfileModal = ({ isOpen, userData, onClose, onSave }: EditProfileModalProps) => {
  const [formData, setFormData] = useState(userData);
  const [errors, setErrors] = useState<{ name?: string; username?: string }>({});
  const colors = getColors();
  
  if (!isOpen) return null;
  
  const validateForm = () => {
    const newErrors: { name?: string; username?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.surface }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Edit Profile
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.background,
                border: errors.name ? `1px solid ${colors.status.error}` : `1px solid ${colors.text.muted}30`,
                color: colors.text.primary
              }}
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: colors.status.error }}>{errors.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.background,
                border: errors.username ? `1px solid ${colors.status.error}` : `1px solid ${colors.text.muted}30`,
                color: colors.text.primary
              }}
            />
            {errors.username && (
              <p className="text-xs mt-1" style={{ color: colors.status.error }}>{errors.username}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.text.muted}30`,
                color: colors.text.primary
              }}
              placeholder="City, Country"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 resize-none"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.text.muted}30`,
                color: colors.text.primary
              }}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};