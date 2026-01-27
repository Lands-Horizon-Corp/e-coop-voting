"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useInfoModal } from "@/stores/use-info-modal-store";

const InfoModal = () => {
    const { isOpen, onClose, onConfirm, infoDatas } = useInfoModal();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-fit max-w-7xl shadow-2 border-none shadow-2 sm:rounded-2xl font-inter">
                <DialogHeader>
                    <DialogTitle className="font-medium">
                        {infoDatas?.title}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="my-1 text-center lg:text-left lg:my-4">
                    {infoDatas?.description}
                </DialogDescription>
                {infoDatas?.component}
                <Separator className="bg-muted/70" />
                {!infoDatas?.hideConfirm && (
                    <div className="flex justify-center gap-x-2">
                        <Button onClick={onConfirm}>
                            {infoDatas?.confirmString}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default InfoModal;
