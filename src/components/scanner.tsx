import { Capacitor } from "@capacitor/core";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import { useQueryClient } from "@tanstack/react-query";
import { Html5Qrcode } from "html5-qrcode";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import useOrderBasket from "@/pages/hame/action";
import { apiRoutes } from "@/service/apiRoutes";

import { Button } from "./ui/button";

const qrRegionId = "qr-reader";

interface ICodeProps {
  type: string;
  link: string;
}

export const QrBarcodeScanner = (props: ICodeProps) => {
  const { link, type } = props;
  const [isTransfer] = useQueryState('isTransfer')
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const queryClient = useQueryClient();
 

  const { mutate } = useOrderBasket({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.orderBasket] });
      toast.success("Продукт добавлено успешно!");
      window.location.replace(import.meta.env.BASE_URL);
    },
  });

  const checkAndRequestCameraPermission = async (): Promise<boolean> => {
    const { camera } = await BarcodeScanner.checkPermissions();
    if (camera === "granted") return true;

    const { camera: requested } = await BarcodeScanner.requestPermissions();
    return requested === "granted";
  };

  const toggleFlash = async () => {
    try {
      setFlashOn((prev) => !prev);
      await BarcodeScanner.enableTorch();
    } catch  {
      toast.error("Фонарик не поддерживается на этом устройстве");
    }
  };

  useEffect(() => {
    const startScanner = async () => {
      if (Capacitor.isNativePlatform()) {
        const hasPermission = await checkAndRequestCameraPermission();
        if (!hasPermission) {
          setError("Рухсат йўқ. Илтимос, камерага рухсат беринг.");
          return;
        }
        try {
          const { barcodes } = await BarcodeScanner.scan();
          if (barcodes.length > 0) {
            if(type === "busket"){
              setResult(barcodes[0].rawValue);
            }else{
              window.location.replace(`${import.meta.env.BASE_URL}${link}?id=${barcodes[0].rawValue}&type=${type}&isTransfer=${isTransfer}`);
            }
          } else {
            setError("Код не найден!");
          }
        } catch {
          setError("Ошибка сканирования на нативной платформе.");
        }
      } else {
        try {
          const cameras = await Html5Qrcode.getCameras();
          if (!cameras.length) {
            setError("No cameras found");
            return;
          }

          let backCamera = cameras.find((cam) =>
            cam.label.toLowerCase().includes("back")
          );
          if (!backCamera) backCamera = cameras[0];

          const cameraId = backCamera.id;
          html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

          await html5QrCodeRef.current.start(
            cameraId,
            {
              fps: 10,
              qrbox: { width: 350, height: 150 },
              aspectRatio: 1.7778,
            },
            (decodedText) => {
              if(type === "busket"){
                setResult(decodedText)
              }else{
                window.location.replace(`${import.meta.env.BASE_URL}${link}?id=${decodedText}&type=${type}&isTransfer=${isTransfer}`);
              }
            },
            () => {}
          );
        } catch {
          setError("Camera access error or permission denied");
        }
      }
    };

    startScanner();

    return () => {
      if (Capacitor.isNativePlatform()) {
        // Stop native scanner
        BarcodeScanner.stopScan().catch(() => {});
        window.location.replace(`${import.meta.env.BASE_URL}${link}`);
      } else if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        window.location.replace(`${import.meta.env.BASE_URL}${link}`);
      }
    
    };
  }, [link]);

  return (
    <div className="max-full h-[calc(100vh-78px)] overflow-hidden relative">
      {!Capacitor.isNativePlatform() && (
        <div
          id={qrRegionId}
          className="w-full h-[calc(100vh-78px)] text-center bg-background rounded-md"
        />
      )}

      {Capacitor.isNativePlatform() && (
        <div className="absolute top-4 right-4">
          <Button onClick={toggleFlash}>
            {flashOn ? "🔦 Turn off" : "💡 Turn on"}
          </Button>
        </div>
      )}

      {result && (
        <div className="absolute mx-auto cursor-pointer bottom-[30px] w-full text-center">
          <Button
            onClick={async () => {
              if (html5QrCodeRef.current) {
                await html5QrCodeRef.current.stop();
              }

              if (type === "busket") {
                if (result) {
                  mutate({
                    qr_code: Number(result),
                    x: 1,
                    isMetric: false,
                  });
                } else {
                  toast.error("Продукт не найден!");
                }
              } else {
                window.location.replace(`${import.meta.env.BASE_URL}${link}?id=${result}&type=${type}`);
              }
            }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-2 rounded-md text-center text-lg font-semibold shadow-md"
          >
            {result}
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          <p className="font-medium">❌ Error:</p>
          <p>{error}</p>
        </div>
      )}

      {!result && !error && (
        <p className="mt-4 text-sm text-gray-500 text-center">
          Align your QR or barcode inside the box
        </p>
      )}
    </div>
  );
};
