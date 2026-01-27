"use client";
import QrReader from "../qr-reader";
import { useQrReaderModal } from "@/stores/use-qr-scanner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const QrReaderModal = () => {
    const { isOpen, onClose, onScan } = useQrReaderModal();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <div className="p-4">
                    <QrReader onScan={onScan} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QrReaderModal;
