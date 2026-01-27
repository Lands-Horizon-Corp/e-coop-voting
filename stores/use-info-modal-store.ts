import { create } from "zustand";

interface IInfoDatas{
    title: string;
    description: string;
    component : React.ReactNode;
    confirmString?: string;
    hideConfirm? : boolean;
    onConfirm?: () => void;
}

interface IInfoModalStore {
    isOpen: boolean;
    infoDatas?: IInfoDatas;

    onOpen: (infoData: IInfoDatas) => void;

    onClose: () => void;
    onConfirm: () => void;
}

export const useInfoModal = create<IInfoModalStore>((set) => ({
    isOpen: false,

    onOpen: (infoData) =>
        set({
            isOpen: true,
            infoDatas: {
                ...infoData,
                confirmString: infoData.confirmString ?? "Confirm",
            },
        }),
    onClose: () => set({ isOpen: false }),

    onConfirm: () =>
        set((state) => {
            if (state.infoDatas?.onConfirm) state.infoDatas.onConfirm();
            return { isOpen: false };
        }),
}));
