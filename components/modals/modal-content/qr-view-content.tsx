"use client";

import QrCode from "@/components/qr-code";
import { cn } from "@/lib/utils";

type Props = {
    value: string;
    fileName? : string;
    enableDownload?: boolean;

    className?: string;
    qrClassName? : string;
};

const QrViewContent = ({ className, qrClassName, value, fileName, enableDownload = false }: Props) => {

    return (
        <div className={cn("flex items-center justify-center", className)}>
            <QrCode className={qrClassName} fileName={fileName} showDownload={enableDownload} value={value} />
        </div>
    );
};

export default QrViewContent;
