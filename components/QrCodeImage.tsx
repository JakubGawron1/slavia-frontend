"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QrCodeImage({
  value,
  size = 280,
  alt = "Kod QR",
  className,
}: {
  value: string;
  size?: number;
  alt?: string;
  className?: string;
}) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          errorCorrectionLevel: "M",
          color: { dark: "#0e1014", light: "#f7f5f2" },
        });
        if (!cancelled) setSrc(dataUrl);
      } catch {
        if (!cancelled) setSrc("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!src) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={size} height={size} className={className} />
  );
}
