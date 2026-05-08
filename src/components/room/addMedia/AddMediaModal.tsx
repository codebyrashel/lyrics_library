import { X, Info, Upload } from 'lucide-react';
import { useState } from 'react';
import { getColors } from '@/store/colorStore';
import { YouTubeForm } from './YouTubeForm';

interface AddMediaModalProps {
  roomId: string;
  onClose: () => void;
  onAddToPlaylist: (item: any) => Promise<boolean>;
  isAdding: boolean;
}

export const AddMediaModal = ({ roomId, onClose, onAddToPlaylist, isAdding }: AddMediaModalProps) => {
  const colors = getColors();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const handleLocalFileClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const handleAddSuccess = () => {
    setAddSuccess(true);
    setTimeout(() => {
      onClose();
    }, 500); // Small delay to show success message
  };

  if (addSuccess) {
    return null; // Modal will close
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-xl max-w-md w-full p-6"
        style={{ backgroundColor: colors.surface }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>
            Add Media
          </h2>
          <button onClick={onClose}>
            <X size={20} style={{ color: colors.text.muted }} />
          </button>
        </div>

        <div className="space-y-4">
          {/* YouTube Form - Active */}
          <YouTubeForm
            onAddToPlaylist={onAddToPlaylist}
            onSuccess={handleAddSuccess}
            isAdding={isAdding}
          />
          
          <Divider colors={colors} />
          
          {/* Local File - Coming Soon */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
              Local File
            </label>
            <div
              onClick={handleLocalFileClick}
              className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:bg-opacity-80"
              style={{ 
                borderColor: `${colors.primary}50`,
                backgroundColor: `${colors.primary}5`
              }}
            >
              <Upload size={32} style={{ color: colors.primary }} />
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: colors.primary }}>
                  Coming Soon
                </p>
                <p className="text-xs mt-1" style={{ color: colors.text.muted }}>
                  Local file streaming with WebRTC is under development
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Toast Notification */}
      {showComingSoon && (
        <div 
          className="fixed bottom-20 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg"
          style={{ 
            backgroundColor: colors.surface,
            border: `1px solid ${colors.primary}30`,
            boxShadow: `0 4px 12px rgba(0,0,0,0.1)`
          }}
        >
          <Info size={16} style={{ color: colors.primary }} />
          <span className="text-sm" style={{ color: colors.text.primary }}>
            Local file streaming is coming soon!
          </span>
        </div>
      )}
    </div>
  );
};

const Divider = ({ colors }: { colors: any }) => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t" style={{ borderColor: `${colors.text.muted}20` }} />
    </div>
    <div className="relative flex justify-center text-xs">
      <span className="px-2" style={{ backgroundColor: colors.surface, color: colors.text.muted }}>
        OR
      </span>
    </div>
  </div>
);