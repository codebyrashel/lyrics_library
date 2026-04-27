'use client';

import { useState } from 'react';
import { Plus, Video, Upload, X } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { useRoom } from '@/contexts/RoomContext';

export const AddMedia = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [localFile, setLocalFile] = useState<File | null>(null);
  const colors = getColors();
  const { addToQueue } = useRoom();

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  const handleAddYouTube = () => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      addToQueue({
        id: Date.now().toString(),
        title: `YouTube Video ${videoId}`,
        type: 'youtube',
        videoId,
        addedBy: 'You'
      });
      setUrl('');
      setIsOpen(false);
    }
  };

  const handleLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addToQueue({
        id: Date.now().toString(),
        title: file.name,
        type: 'local',
        url,
        addedBy: 'You'
      });
      setLocalFile(null);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)} className="w-full">
        <Plus size={18} className="mr-2" />
        Add to Queue
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
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text.primary
                    }}
                  />
                  <Button variant="primary" onClick={handleAddYouTube}>
                    <Video size={16} />
                  </Button>
                </div>
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
                  className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-all hover:scale-105"
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