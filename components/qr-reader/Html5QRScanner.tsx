"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const qrcodeRegionId = "html5qr-code-full-region";

type Props = {
  className?: string;
  onRead: (data: string) => void;
  onErr?: undefined | ((e: unknown) => void);
};

const Html5QRScanner = ({ className, onRead, onErr }: Props) => {
  const ref = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!ref.current) {
      ref.current = new Html5QrcodeScanner(
        qrcodeRegionId,
        { fps: 60, qrbox: 280, disableFlip: false },
        false,
      );
    }

    const html5QrcodeScanner = ref.current;

    setTimeout(() => {
      const container = document.getElementById(qrcodeRegionId);
      if (html5QrcodeScanner && container?.innerHTML == "") {
        html5QrcodeScanner.render((data) => {
          onRead(data);
        }, onErr);
      }
    }, 0);

    return () => {
      html5QrcodeScanner.clear();
    };
  }, []);

  return (
    <div className={cn("flex flex-col", className)}>
      <div id={qrcodeRegionId} className="flex flex-col items-center" />
    </div>
  );
};

export default Html5QRScanner;
