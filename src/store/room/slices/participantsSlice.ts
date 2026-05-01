import { Participant } from '../types';

export interface ParticipantsSlice {
  participants: Participant[];
}

export const initialParticipantsState: ParticipantsSlice = {
  participants: [
    { id: '1', name: 'You', isHost: true }
  ],
};

export const participantsActions = (set: any) => ({
  addParticipant: (participant: Participant) => {
    set((state: any) => ({
      participants: [...state.participants, participant]
    }));
  },

  removeParticipant: (id: string) => {
    set((state: any) => ({
      participants: state.participants.filter((p: Participant) => p.id !== id)
    }));
  },
});