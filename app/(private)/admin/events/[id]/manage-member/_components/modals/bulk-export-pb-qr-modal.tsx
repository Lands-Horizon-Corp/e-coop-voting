import { toast } from "sonner";
import { useState } from "react";
import { FaFileZipper as ZipFileIcon } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import ModalHead from "@/components/modals/modal-head";
import LoadingSpinner from "@/components/loading-spinner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { PB_QR_EXPORT_BATCH_SIZE } from "@/constants";
import { useEventQrPbExport } from "@/hooks/api-hooks/use-qr-pb-export";

interface generateQrModalProps {
    eventId: number;
    totalMembers: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const calculateBatch = (
    n: number,
    chunkSize: number = PB_QR_EXPORT_BATCH_SIZE
): number[] => {
    const chunkCount = Math.ceil(n / chunkSize);
    return Array.from({ length: chunkCount }, (_, index) => index + 1);
};

const downloadExternalURL = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `QR_Passbooks.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download started");
};

const DownloadChunk = ({
    batch,
    eventId,
    blocked = true,
    onComplete,
    onGenerating,
}: {
    eventId: number;
    batch: number;
    blocked?: boolean;
    onGenerating?: () => void;
    onComplete?: () => void;
}) => {
    const {
        data,
        refetch: generateQr,
        isFetching,
    } = useEventQrPbExport({
        batch,
        eventId,
        showPbNumberText: true,
        enable: false,
        onSuccess: (data) => {
            if (!data?.url) {
                toast.error("Failed to retrieve download URL");
                return;
            }
            downloadExternalURL(data.url);
        },
        onError: (error) => {
            toast.error(`Export failed: ${error}`);
        },
    });

    const handleExport = (batch: number) => {
        onGenerating?.();
        toast.promise(generateQr(), {
            loading: `Generating Batch ${batch} QR codes, this may take a while please wait...`,
            success: () => {
                onComplete?.();
                return `Batch ${batch} has generated & now downloading`;
            },
            error: "Error",
        });
    };

    return (
        <div className="flex justify-between rounded-lg bg-popover px-4 py-2 items-center gap-x-4">
            <p className="">
                <ZipFileIcon className="inline mr-2 text-orange-400 dark:text-amber-200 " />
                QRCode Batch {batch} zip
            </p>
            <div className="flex items-center gap-x-2">
                {data?.url && !isFetching && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleExport(batch)}
                        disabled={isFetching || blocked}
                    >
                        {isFetching ? <LoadingSpinner /> : "Regenerate"}
                    </Button>
                )}
                <Button
                    size="sm"
                    variant="ghost"
                    className="border"
                    onClick={() => {
                        if (data?.url) return downloadExternalURL(data.url);
                        handleExport(batch);
                    }}
                    disabled={isFetching || blocked}
                >
                    {isFetching ? <LoadingSpinner /> : "Export"}
                </Button>
            </div>
        </div>
    );
};

export const BulkExportPbQrModal = ({
    eventId,
    totalMembers,
    open,
    onOpenChange,
}: generateQrModalProps) => {
    const [pendingExport, setPendingExport] = useState<number[]>([]);

    const batch = calculateBatch(totalMembers);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl overflow-y-auto thin-scroll max-w-xl max-h-[80vh]  font-inter">
                <ModalHead
                    title="Export member PB QR Codes"
                    description={`Export Member QR codes for the current event. To prevent server overload, export batches of ${PB_QR_EXPORT_BATCH_SIZE} QR codes per generation.`}
                />
                <div className="grid grid-cols-1 gap-2">
                    {batch.map((batch) => (
                        <DownloadChunk
                            key={batch}
                            batch={batch}
                            eventId={eventId}
                            onGenerating={() => {
                                setPendingExport((prev) => [...prev, batch]);
                                toast.info(
                                    "Maximum pending generation is 3, please wait for other to finish.."
                                );
                            }}
                            onComplete={() =>
                                setPendingExport((prev) =>
                                    prev.filter((val) => val !== batch)
                                )
                            }
                            blocked={
                                pendingExport.length >= 2 &&
                                !pendingExport.includes(batch)
                            }
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BulkExportPbQrModal;
