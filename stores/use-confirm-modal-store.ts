import { ReactNode } from "react";
import { create } from "zustand";

interface confirmDatas {
    title: string;
    description? : string;
    confirmString?: string;
    cancelString?: string;
    contentComponent? : ReactNode,
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface confirmModalStore {
    isOpen: boolean;
    confirmDatas?: confirmDatas;
    
    onOpen: ( dialogData : confirmDatas ) => void;

    onClose: () => void;
    onConfirm: () => void;
    onCancel: () => void;
}

export const useConfirmModal = create<confirmModalStore>((set) => ({
    isOpen: false,

    onOpen: ( confirmData ) => set({ isOpen: true, confirmDatas: {...confirmData, confirmString : confirmData.confirmString ?? "Confirm", cancelString : confirmData.cancelString ?? "Cancel" } }),
    onClose: () => set({ isOpen: false }),

    onConfirm: () =>
        set((state) => {
            if (state.confirmDatas?.onConfirm) state.confirmDatas.onConfirm();
            return { isOpen: false };
        }),
    onCancel: () =>
        set((state) => {
            if (state.confirmDatas?.onCancel) state.confirmDatas.onCancel();
            return { isOpen: false };
        }),
}));
