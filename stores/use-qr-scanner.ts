import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { create } from "zustand";

interface IQRScannerDatas {
    onScan: (detectedCodes: IDetectedBarcode[]) => void;
}

interface IQRModalStore {
    isOpen: boolean;
    scannerDatas?: IQRScannerDatas;

    onClose: () => void;
    onOpenQR: (infoData: IQRScannerDatas) => void;
    onScan: (detectedCodes: IDetectedBarcode[]) => void;
}

export const useQrReaderModal = create<IQRModalStore>((set) => ({
    isOpen: false,
    onOpenQR: (scannerDatas) =>
        set({
            isOpen: true,
            scannerDatas,
        }),
    onClose: () => set({ isOpen: false }),
    onScan: (datas: IDetectedBarcode[]) => {
        if (datas.length === 0) return;
        set(({ scannerDatas }) => {
            if (scannerDatas?.onScan) scannerDatas.onScan(datas);
            return { isOpen: false };
        });
    },
}));
