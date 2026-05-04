import { X } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { YouTubeForm } from './YouTubeForm';
import { LocalFileUpload } from './LocalFileUpload';

interface AddMediaModalProps {
  roomId: string;
  onClose: () => void;
  onAddToPlaylist: (item: any) => Promise<boolean>;
  isAdding: boolean;
}

export const AddMediaModal = ({ roomId, onClose, onAddToPlaylist, isAdding }: AddMediaModalProps) => {
  const colors = getColors();

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
          <YouTubeForm
            onAddToPlaylist={onAddToPlaylist}
            isAdding={isAdding}
          />
          
          <Divider colors={colors} />
          
          <LocalFileUpload
            roomId={roomId}
            onSuccess={onClose}
            isAdding={isAdding}
          />
        </div>
      </div>
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