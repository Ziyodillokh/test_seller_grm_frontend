import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Printer, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

import { QRCodeGenerator } from "@/components/qr-code-generator.tsx";

import BarcodeGenerator from "./react-barcode";
import { Button } from "./ui/button";
type IQrCode = "Barcode" | "QrCode";
export default function BarcodeQenerat() {
  const { watch } = useFormContext();
  const WatchValue = watch();
  const pathname = useLocation();

  const printRef = useRef<HTMLDivElement>(null);
  const [isQrCode, setIsQrCode] = useState<IQrCode>("Barcode");

  // useEffect(() => {
  //   console.log('watcha value', WatchValue);
  // }, [WatchValue]);

  const handlePrint = useReactToPrint({
    // @ts-ignore
    content: () => {
      if (!printRef.current) {
        return null;
      }
      return printRef.current;
    },
    contentRef: printRef,

    documentTitle: "Barcode Print",
    removeAfterPrint: true,
  });
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Gilam Barcode",
          text: "I found something interesting!",
          url: window.location.href,
        });
        toast.success("Успешно поделились!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Your browser does not support sharing.");
    }
  };

  const downloadPDF = async () => {
    // console.log("click")
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("download.pdf");
  };

  return (
    WatchValue?.code && (
      <div className="w-full">
        <div className=" border-y border-border  h-[64px] rounded-t-sm flex   ">
          <Button
            type="button"
            className="h-full w-1/2 border-r-1 text-primary  justify-center font-[16px] gap-1.5  border-y-0  border-l-1"
            variant={"outline"}
            onClick={() => setIsQrCode("Barcode")}
          >
            Штрих-код
          </Button>
          <Button
            type="button"
            className="h-full  w-1/2  border-r-1 text-primary justify-center font-[16px] gap-1.5  border-y-0  border-l-0"
            variant={"outline"}
            onClick={() => setIsQrCode("QrCode")}
          >
            QR-код
          </Button>
        </div>
        <div
          ref={printRef}
          className={`p-[30px] ${WatchValue?.code ? "bg-white" : ""}`}
        >
          <div className="rounded-1 px-11 py-[24px] text-center">
            <h4 className="font-bold text-[24px] ">
              {WatchValue?.collection?.label}
            </h4>
            <div className="flex items-center justify-center gap-[15px]">
              <p className="font-medium text-[15px]">
                {WatchValue?.model?.label}
              </p>
              <p className="font-medium text-[15px]">
                {WatchValue?.size?.label}
              </p>
              <p className="font-medium text-[15px]">
                {WatchValue?.color?.label}
              </p>
            </div>
            {isQrCode === "Barcode" && (
              <BarcodeGenerator value={WatchValue?.code || ""} />
            )}
            {isQrCode === "QrCode" && (
              <QRCodeGenerator productId={WatchValue.code || ""} />
            )}
          </div>
        </div>
        {pathname.pathname === "/product-check" && (
          <div className="bg-sidebar border-y text-primary border-border  h-[44px] rounded-t-sm flex   ">
            <Button
              onClick={() => handleShare()}
              type="button"
              className="h-full border-r-1 w-1/3 justify-center font-[16px] gap-1  border-y-0  border-l-1"
              variant={"outline"}
            >
              <Share2 size={16} />
              Поделится
            </Button>
            <Button
              onClick={() => handlePrint()}
              type="button"
              className="h-full w-1/3 border-r-1 text-primary justify-center font-[16px] gap-1.5  border-y-0  border-l-0"
              variant={"outline"}
            >
              <Printer size={16} />
              Распечатать
            </Button>
            <Button
              onClick={() => downloadPDF()}
              type="button"
              className="h-full w-1/3 border-r-1 text-primary justify-center font-[16px] gap-1.5  border-y-0  border-l-0"
              variant={"outline"}
            >
              <Download size={16} />
              Скачать
            </Button>
          </div>
        )}
      </div>
    )
  );
}
