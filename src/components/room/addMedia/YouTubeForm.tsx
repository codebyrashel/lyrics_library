import { useState } from 'react';
import { Play } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { useYouTubeTitle } from './hooks/useYouTubeTitle';
import { extractYouTubeId } from './utils/youtubeUtils';
import { useAuth } from '@/contexts/AuthContext';

interface YouTubeFormProps {
  onAddToPlaylist: (item: any) => Promise<boolean>;
  isAdding: boolean;
}

export const YouTubeForm = ({ onAddToPlaylist, isAdding }: YouTubeFormProps) => {
  const [url, setUrl] = useState('');
  const { videoTitle, isLoadingTitle, fetchTitle } = useYouTubeTitle();
  const colors = getColors();
  const { user } = useAuth();

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    const videoId = extractYouTubeId(newUrl);
    if (videoId) {
      await fetchTitle(videoId);
    }
  };

  const handleAddYouTube = async () => {
    const videoId = extractYouTubeId(url);
    if (videoId && videoTitle && user) {
      const newItem = {
        title: videoTitle,
        type: 'youtube' as const,
        videoId,
        addedBy: user.id,
        addedByName: user.name,
      };
      
      const success = await onAddToPlaylist(newItem);
      if (success) {
        setUrl('');
      }
    }
  };

  const isValid = videoTitle && !isLoadingTitle;
  const showError = url && !videoTitle && !isLoadingTitle;

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
        YouTube URL
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://youtube.com/watch?v=..."
          className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
          style={{
            backgroundColor: colors.background,
            color: colors.text.primary
          }}
        />
        <Button 
          variant="primary" 
          onClick={handleAddYouTube}
          disabled={!isValid || isAdding}
        >
          {isLoadingTitle ? 'Loading...' : <Play size={16} />}
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
  );
};