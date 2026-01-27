"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ConfirmModal = () => {
    const { isOpen, onClose, onCancel, onConfirm, confirmDatas } =
        useConfirmModal();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <DialogHeader>
                    <DialogTitle className="font-medium">
                        {confirmDatas?.title}
                    </DialogTitle>
                </DialogHeader>
                {confirmDatas?.description && (
                    <DialogDescription className="my-4">
                        {confirmDatas?.description}
                    </DialogDescription>
                )}
                <Separator className="bg-muted/70" />
                {confirmDatas?.contentComponent}
                <div className="flex justify-end gap-x-2">
                    <Button
                        onClick={onCancel}
                        variant={"ghost"}
                        className="bg-muted/60 hover:bg-muted"
                    >
                        {confirmDatas?.cancelString}
                    </Button>
                    <Button onClick={onConfirm}>
                        {confirmDatas?.confirmString}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmModal;
