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
  fileName?: string;
  themeResponsive?: boolean;

  className?: string;
  showDownload?: boolean;

  title?: string;
  description?: string;
};

const QrCode = ({
  value,
  fileName,
  className,
  themeResponsive = false,
  showDownload = false,
  title,
  description,
}: Props) => {
  const [renderingDownloadQR, setRenderingDownloadQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const downloadName = fileName || value;

  const downloadQRCode = () => {
    if (!qrRef.current) return;
    setRenderingDownloadQR(true);

    htmlToImage
      .toJpeg(qrRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff", // Ensures a solid background in the export
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${downloadName}.jpeg`;
        link.href = dataUrl;
        link.click();
        toast.success("QR Code downloaded");
      })
      .catch(() => {
        toast.error("Could not generate QR Code");
      })
      .finally(() => {
        setRenderingDownloadQR(false);
      });
  };

  return (
    <div className="flex flex-col gap-y-4">
      {/* Downloadable Area */}
      <div
        ref={qrRef}
        className={cn(
          "w-[300px] min-h-[350px] flex flex-col items-center p-6 rounded-xl bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] border-secondary",
          !themeResponsive && "bg-white",
          className,
        )}
      >
        {/* QR Code Section */}
        <div className="size-[250px] flex items-center justify-center mb-4">
          {value.length === 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-gray-700/70">
              <QrCodeIcon className="size-12" />
              <p className="text-xs text-center">Enter value</p>
            </div>
          ) : (
            <QRCodeSVG
              value={value}
              className="h-full w-full duration-300 rounded-sm"
              bgColor="transparent"
              fgColor={themeResponsive ? "currentColor" : "black"}
              level={"L"}
              includeMargin={false}
            />
          )}
        </div>

        {/* Text Section (Inside the Ref for downloading) */}
        {(title || description) && (
          <div className="text-center flex flex-col gap-y-1 ">
            {title && <h3 className="font-bold text-lg text-black">{title}</h3>}
            {description && (
              <p className="text-sm text-black max-w-[240px] break-words">
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      {showDownload && (
        <Button
          onClick={downloadQRCode}
          disabled={!value || value.length === 0 || renderingDownloadQR}
          className="gap-x-2 rounded-full"
        >
          {renderingDownloadQR ? (
            <LoadingSpinner />
          ) : (
            <Download className="size-4" strokeWidth={1} />
          )}
          Download QR
        </Button>
      )}
    </div>
  );
};

export default QrCode;
