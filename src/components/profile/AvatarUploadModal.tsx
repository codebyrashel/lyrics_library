'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import AvatarEditor from 'react-avatar-editor';
import { Button } from '@/components/ui/Button';
import { getColors } from '@/store/colorStore';
import { X, Upload, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blob: Blob) => void;
  currentAvatar?: string;
}

export const AvatarUploadModal = ({ isOpen, onClose, onSave, currentAvatar }: AvatarUploadModalProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const editorRef = useRef<AvatarEditor>(null);
  const colors = getColors();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  const handleRotate = () => {
    setRotation(rotation + 90);
  };

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          onSave(blob);
          onClose();
          resetState();
        }
      }, 'image/png');
    }
  };

  const resetState = () => {
    setImage(null);
    setZoom(1);
    setRotation(0);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-xl max-w-md w-full p-6"
        style={{ backgroundColor: colors.surface }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>
            Upload Profile Picture
          </h2>
          <button onClick={handleClose}>
            <X size={20} style={{ color: colors.text.muted }} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Image Preview / Editor */}
          <div className="flex justify-center">
            {image ? (
              <AvatarEditor
                ref={editorRef}
                image={image}
                width={200}
                height={200}
                border={50}
                borderRadius={100}
                color={[255, 255, 255, 0.6]}
                scale={zoom}
                rotate={rotation}
                className="rounded-full"
              />
            ) : (
              <div 
                className="w-48 h-48 rounded-full flex items-center justify-center border-2 border-dashed relative overflow-hidden"
                style={{ borderColor: colors.primary, backgroundColor: colors.background }}
              >
                {currentAvatar ? (
                  <Image 
                    src={currentAvatar} 
                    alt="Current avatar" 
                    width={192}
                    height={192}
                    className="w-full h-full rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <Upload size={32} style={{ color: colors.text.muted }} />
                )}
              </div>
            )}
          </div>

          {/* File Input */}
          {!image && (
            <label
              className="flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer transition-colors hover:bg-opacity-80"
              style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
            >
              <Upload size={18} />
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {/* Zoom Controls */}
          {image && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ZoomIn size={16} style={{ color: colors.text.muted }} />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={handleZoomChange}
                  className="flex-1 h-1 rounded-lg"
                  style={{ accentColor: colors.primary }}
                />
                <ZoomOut size={16} style={{ color: colors.text.muted }} />
              </div>
              
              <div className="flex justify-center gap-2">
                <button
                  onClick={handleRotate}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: colors.text.secondary }}
                >
                  <RotateCw size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {image && (
              <Button variant="primary" onClick={handleSave} className="flex-1">
                Save Avatar
              </Button>
            )}
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};