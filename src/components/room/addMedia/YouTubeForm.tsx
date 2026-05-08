import { useState } from 'react';
import { Play } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { useYouTubeTitle } from './hooks/useYouTubeTitle';
import { useAuth } from '@/contexts/AuthContext';
import { guestService } from '@/services/guest.service';
import { useRoomStore } from '@/store/roomStore';
import { Toast } from '@/components/ui/Toast';

const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  let cleanUrl = url.split('?')[0];
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
    /(?:youtube\.com\/v\/)([^?]+)/,
    /(?:youtube\.com\/shorts\/)([^?]+)/,
    /(?:m\.youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtube\.com\/live\/)([^?]+)/
  ];
  
  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

interface YouTubeFormProps {
  onAddToPlaylist: (item: any) => Promise<boolean>;
  onSuccess?: () => void;
  isAdding: boolean;
}

export const YouTubeForm = ({ onAddToPlaylist, onSuccess, isAdding }: YouTubeFormProps) => {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { videoTitle, isLoadingTitle, fetchTitle, resetTitle } = useYouTubeTitle();
  const colors = getColors();
  const { user } = useAuth();
  const isGuest = guestService.isGuest();
  const existingPlaylist = useRoomStore((state) => state.playlist);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    const videoId = extractYouTubeId(newUrl);
    if (videoId) {
      await fetchTitle(videoId);
    } else {
      resetTitle();
    }
  };

  const handleAddYouTube = async () => {
    if (isProcessing || isAdding) return;
    
    const videoId = extractYouTubeId(url);
    if (!videoId || !videoTitle) return;
    
    // Check for duplicate in current playlist
    const isDuplicate = existingPlaylist.some(
      item => item.type === 'youtube' && item.videoId === videoId
    );
    
    if (isDuplicate) {
      showToast('This video is already in the watchlist!', 'error');
      return;
    }
    
    setIsProcessing(true);
    
    const newItem = {
      title: videoTitle,
      type: 'youtube' as const,
      videoId,
      addedBy: user?.id || guestService.getGuestId(),
      addedByName: user?.name || 'Guest',
    };
    
    try {
      const success = await onAddToPlaylist(newItem);
      console.log('[YouTubeForm] onAddToPlaylist result:', success);
      
      // Always show success and close modal since optimistic update already added to UI
      showToast('Video added to watchlist!', 'success');
      setUrl('');
      resetTitle();
      
      // Close modal after short delay to show success message
      setTimeout(() => {
        onSuccess?.();
      }, 500);
    } catch (error) {
      console.error('[YouTubeForm] Error adding video:', error);
      showToast('Failed to add video. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const isValid = videoTitle && !isLoadingTitle && !isProcessing;
  const showError = url && !videoTitle && !isLoadingTitle;

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
          YouTube URL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://youtube.com/watch?v=... or youtu.be/..."
            className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: colors.background,
              color: colors.text.primary
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `${colors.text.muted}30`;
              e.target.style.boxShadow = 'none';
            }}
          />
          <Button 
            variant="primary" 
            onClick={handleAddYouTube}
            disabled={!isValid || isAdding || isProcessing}
          >
            {isLoadingTitle || isProcessing ? 'Adding...' : <Play size={16} />}
          </Button>
        </div>
        {videoTitle && (
          <p className="text-xs mt-1" style={{ color: colors.text.muted }}>
            {videoTitle}
          </p>
        )}
        {showError && (
          <p className="text-xs mt-1" style={{ color: colors.status.error }}>
            Please enter a valid YouTube URL
          </p>
        )}
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};