"use client";

import QrCode from "@/components/qr-code";
import { cn } from "@/lib/utils";
import { Description } from "@radix-ui/react-dialog";
import { title } from "process";

type Props = {
  value: string;
  fileName?: string;
  enableDownload?: boolean;

  className?: string;
  qrClassName?: string;
  title?: string;
  description?: string;
};

const QrViewContent = ({
  className,
  qrClassName,
  value,
  fileName,
  enableDownload = false,
  description = "",
  title = "",
}: Props) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <QrCode
        className={qrClassName}
        fileName={fileName}
        showDownload={enableDownload}
        value={value}
        title={title}
        description={description}
      />
    </div>
  );
};

export default QrViewContent;
