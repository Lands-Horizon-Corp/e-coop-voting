import { create } from "zustand";

export type ModalType = "";

interface ModalData {}

interface AdminModalStore {
    state: boolean;
    modalType: ModalType | null;

    data: ModalData;

    open: (modalType: ModalType, modal: ModalData) => void;
    close: () => void;
}

export const userModalStore = create<AdminModalStore>((set) => ({
    state: false,
    modalType: null,
    data: {},
    open: (modalType, data) => set({ state: true, modalType, data }),
    close: () => set({ state: false, modalType: null }),
}));
