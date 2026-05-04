'use client';

import { useState, useEffect } from 'react';
import { getColors } from '@/store/colorStore';
import { useAuth } from '@/contexts/AuthContext';
// import { wsService } from '@/services/websocket.service';
import { ParticipantHeader } from './ParticipantHeader';
import { ParticipantList } from './ParticipantList';
import { LoadingState } from './LoadingState';
import { useParticipants } from './hooks/useParticipants';

interface ParticipantsProps {
  roomId: string;
}

export const Participants = ({ roomId }: ParticipantsProps) => {
  const colors = getColors();
  const { user } = useAuth();
  const { participants, isLoading, loadParticipants } = useParticipants(roomId);

  useEffect(() => {
    loadParticipants();
  }, [roomId]);

  if (isLoading) {
    return <LoadingState colors={colors} />;
  }

  return (
    <div
      className="flex flex-col h-128 rounded-xl overflow-hidden"
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <ParticipantHeader participantCount={participants.length} colors={colors} />
      <ParticipantList participants={participants} currentUser={user} colors={colors} />
    </div>
  );
};