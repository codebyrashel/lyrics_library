'use client';

import { useState } from 'react';
import { X, Circle, Clock, MinusCircle, EyeOff, Check } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { UserStatus, statusConfig, statusDurations, StatusDuration } from '@/types/status';
import { statusService } from '@/services/status.service';
import { wsService } from '@/services/websocket.service';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: UserStatus;
  onStatusChange: (status: UserStatus) => void;
}

export const StatusModal = ({ isOpen, onClose, currentStatus, onStatusChange }: StatusModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>(currentStatus);
  const [selectedDuration, setSelectedDuration] = useState<StatusDuration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const colors = getColors();

  const statuses: UserStatus[] = ['online', 'idle', 'dnd', 'invisible'];

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'online': return <Circle size={16} fill={statusConfig.online.color} stroke={statusConfig.online.color} />;
      case 'idle': return <Clock size={16} style={{ color: statusConfig.idle.color }} />;
      case 'dnd': return <MinusCircle size={16} style={{ color: statusConfig.dnd.color }} />;
      case 'invisible': return <EyeOff size={16} style={{ color: statusConfig.invisible.color }} />;
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    const durationMinutes = selectedDuration?.minutes || null;
    const response = await statusService.updateStatus(selectedStatus, durationMinutes || undefined);
    
    if (response.success) {
      onStatusChange(selectedStatus);
      wsService.send('status_update', {
        status: selectedStatus,
        duration: durationMinutes,
      });
      onClose();
    }
    setIsUpdating(false);
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
            Set Status
          </h2>
          <button onClick={onClose}>
            <X size={20} style={{ color: colors.text.muted }} />
          </button>
        </div>

        {/* Status Options */}
        <div className="space-y-2 mb-6">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                selectedStatus === status ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: selectedStatus === status ? `${colors.primary}10` : colors.background,
                ringColor: colors.primary,
              }}
            >
              {getStatusIcon(status)}
              <span className="flex-1 text-left" style={{ color: colors.text.primary }}>
                {statusConfig[status].label}
              </span>
              {selectedStatus === status && (
                <Check size={16} style={{ color: colors.primary }} />
              )}
            </button>
          ))}
        </div>

        {/* Duration Options (only for non-online statuses) */}
        {selectedStatus !== 'online' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
              Duration
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusDurations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => setSelectedDuration(duration)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedDuration?.value === duration.value
                      ? 'ring-2'
                      : ''
                  }`}
                  style={{
                    backgroundColor: selectedDuration?.value === duration.value ? `${colors.primary}10` : colors.background,
                    color: selectedDuration?.value === duration.value ? colors.primary : colors.text.primary,
                    ringColor: colors.primary,
                  }}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="primary" onClick={handleUpdate} disabled={isUpdating} className="flex-1">
            {isUpdating ? 'Updating...' : 'Set Status'}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};