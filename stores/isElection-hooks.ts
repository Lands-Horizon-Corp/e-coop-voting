import { create } from "zustand";


export const useIsElection = create((set) => ({
     state: false,
     setTrue: () => set({ booleanValue: true }),
     setFalse: () => set({ booleanValue: false }),
}));