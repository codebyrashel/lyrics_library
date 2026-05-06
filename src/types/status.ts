export type UserStatus = 'online' | 'idle' | 'dnd' | 'invisible';

export interface StatusDuration {
  label: string;
  value: string;
  minutes: number | null; // null means forever
}

export const statusDurations: StatusDuration[] = [
  { label: '15 minutes', value: '15m', minutes: 15 },
  { label: '1 hour', value: '1h', minutes: 60 },
  { label: '8 hours', value: '8h', minutes: 480 },
  { label: '24 hours', value: '24h', minutes: 1440 },
  { label: '3 days', value: '3d', minutes: 4320 },
  { label: 'Forever', value: 'forever', minutes: null },
];

export const statusConfig = {
  online: { label: 'Online', color: '#10B981', icon: 'circle' },
  idle: { label: 'Idle', color: '#F59E0B', icon: 'clock' },
  dnd: { label: 'Do Not Disturb', color: '#EF4444', icon: 'minus-circle' },
  invisible: { label: 'Invisible', color: '#6B7280', icon: 'eye-off' },
};