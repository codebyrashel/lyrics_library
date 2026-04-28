'use client';

import { useState } from 'react';
import { Plus, Play, Upload, X } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { useRoomStore } from '@/store/roomStore';

export const AddMedia = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);
  const colors = getColors();
  const { addToQueue, playItem, currentPlaying } = useRoomStore();

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  const fetchVideoTitle = async (videoId: string) => {
    setIsLoadingTitle(true);
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const data = await response.json();
      setVideoTitle(data.title);
    } catch (error) {
      setVideoTitle(`YouTube Video`);
    } finally {
      setIsLoadingTitle(false);
    }
  };

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    const videoId = extractYouTubeId(newUrl);
    if (videoId) {
      await fetchVideoTitle(videoId);
    } else {
      setVideoTitle('');
    }
  };

  const handleAddYouTube = () => {
    const videoId = extractYouTubeId(url);
    if (videoId && videoTitle) {
      const newItem = {
        id: Date.now().toString(),
        title: videoTitle,
        type: 'youtube' as const,
        videoId,
        addedBy: 'You'
      };
      
      addToQueue(newItem);
      
      // If nothing is playing, play immediately
      if (!currentPlaying) {
        playItem(newItem);
      }
      
      setUrl('');
      setVideoTitle('');
      setIsOpen(false);
    }
  };

  const handleLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newItem = {
        id: Date.now().toString(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: 'local' as const,
        url,
        addedBy: 'You'
      };
      
      addToQueue(newItem);
      
      // If nothing is playing, play immediately
      if (!currentPlaying) {
        playItem(newItem);
      }
      
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button 
        variant="primary" 
        onClick={() => setIsOpen(true)} 
        className="flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        <span>Add to Queue</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-xl max-w-md w-full p-6"
            style={{ backgroundColor: colors.surface }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                Add Media
              </h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} style={{ color: colors.text.muted }} />
              </button>
            </div>

            <div className="space-y-4">
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
                    disabled={!videoTitle || isLoadingTitle}
                  >
                    {isLoadingTitle ? 'Loading...' : <Play size={16} />}
                  </Button>
                </div>
                {videoTitle && (
                  <p className="text-xs mt-1" style={{ color: colors.text.muted }}>
                    {videoTitle}
                  </p>
                )}
              </div>

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

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                  Local File
                </label>
                <label
                  className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:bg-opacity-80"
                  style={{ borderColor: `${colors.primary}50`, color: colors.primary }}
                >
                  <Upload size={20} />
                  <span>Click to upload audio/video</span>
                  <input
                    type="file"
                    accept="video/*,audio/*"
                    onChange={handleLocalFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};