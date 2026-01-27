import { toast } from "sonner";
import React, { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import * as htmlToImage from "html-to-image";

import { Download, QrCodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import LoadingSpinner from "../loading-spinner";

type Props = {
    value: string;
    fileName? : string;
    themeResponsive?: boolean;

    className?: string;
    showDownload?: boolean;
};

const QrCode = ({
    value,
    fileName,
    className,
    themeResponsive = false,
    showDownload = false,
}: Props) => {
    const [renderingDownloadQR, setRenderingDownloadQR] = useState(false)
    const qrRef = useRef<HTMLDivElement>(null);
    const downloadName = fileName || value

    const downloadQRCode = () => {
        if (!qrRef.current) return;
        setRenderingDownloadQR(true)

        htmlToImage
            .toJpeg(qrRef.current, { quality: 0.95 })
            .then((dataUrl) => {
                var link = document.createElement("a");
                link.download = `${downloadName}.jpeg`;
                link.href = dataUrl;
                link.click();
                toast.success("QR Code downloaded");

            })
            .catch((error) => {
                toast.error("Could not generated QR Code");
            }).finally(()=>{
                setRenderingDownloadQR(false)
            })
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div
                ref={qrRef}
                className={cn(
                    "size-[300px] flex flex-col justify-center items-center p-5 rounded-xl bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background dark:from-stone-400 to-[#f5f1fd] drop-shadow-xl border-secondary",
                    !themeResponsive && "bg-white",
                    className,
                )}
            >
                {value.length === 0 ? (
                    <div className="flex flex-col items-center gap-y-4  text-gray-700/70">
                        <QrCodeIcon className="size-16" />
                        <p className="text-sm text-center lg:text-lg">
                            Enter value to generate
                        </p>
                    </div>
                ) : (
                    <QRCodeSVG
                        value={value}
                        className="h-full duration-300 w-full rounded-sm "
                        bgColor={themeResponsive ? "transparent" : "transparent"}
                        fgColor={themeResponsive ? "currentColor" : "black"}
                        level={"L"}
                        includeMargin={false}
                    />
                )}
            </div>
            {showDownload && (
                <Button
                    onClick={downloadQRCode}
                    disabled={!value || value.length === 0 || renderingDownloadQR}
                    className="gap-x-2 rounded-full"
                >
                    { renderingDownloadQR ? <LoadingSpinner /> : <Download className="size-4" strokeWidth={1} /> } Download QR
                </Button>
            )}
        </div>
    );
};

export default QrCode;
