import { TSkippedMembers } from '@/types';
import {create} from 'zustand';

interface SkippedStoreState {
  skippedMembers: TSkippedMembers[]; 
  setSkippedMembers: (skippedMembers: TSkippedMembers[]) => void; 
}

const useSkippedStore = create<SkippedStoreState>((set) => ({
  skippedMembers: [],
  setSkippedMembers: (skippedMembers) => set({ skippedMembers }),
}));

export default useSkippedStore;
