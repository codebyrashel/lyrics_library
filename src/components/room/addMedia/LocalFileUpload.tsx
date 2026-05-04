import { useState } from 'react';
import { Upload } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useAuth } from '@/contexts/AuthContext';
import { wsService } from '@/services/websocket.service';

interface LocalFileUploadProps {
  roomId: string;
  onSuccess: () => void;
  isAdding: boolean;
}

export const LocalFileUpload = ({ roomId, onSuccess, isAdding }: LocalFileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const colors = getColors();
  const { user } = useAuth();

  const handleLocalFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid video (MP4, WebM) or audio (MP3, WAV) file');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
    formData.append('addedBy', user.id);
    formData.append('addedByName', user.name);
    
    setIsUploading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/playlist/local`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        wsService.send('playlist:add', {
          roomId,
          item: data.item,
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to upload local file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
    
    e.target.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
        Local File
      </label>
      <label
        className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:bg-opacity-80"
        style={{ borderColor: `${colors.primary}50`, color: colors.primary }}
      >
        <Upload size={20} />
        <span>{isUploading ? 'Uploading...' : 'Click to upload audio/video'}</span>
        <input
          type="file"
          accept="video/mp4,video/webm,video/ogg,audio/mpeg,audio/wav,audio/ogg"
          onChange={handleLocalFile}
          className="hidden"
          disabled={isAdding || isUploading}
        />
      </label>
      <p className="text-xs mt-2" style={{ color: colors.text.muted }}>
        Supported formats: MP4, WebM, MP3, WAV
      </p>
    </div>
  );
};