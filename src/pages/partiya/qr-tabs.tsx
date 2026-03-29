import { Link, useParams } from "react-router-dom";

import { QRBoxIcons, QRSerachIcons } from "@/components/icons";

export default function QrTabs() {
  const {id}=useParams()
  
  return (
    <div className="border-border bg-accent flex  border">
      <div className="p-1 border-r cursor-pointer border-border w-full">
        <Link
          to={`/qr-code-report?type=barcode&link=partiya/${id}`}
          className="flex  h-full border-border text-center border-dashed  hover:bg-background active:bg-transparent  border items-center justify-center flex-col gap-2 p-5 pb-4 w-full"
        >
          <QRSerachIcons />
          <p className="text-primary text-[12px] leading-[100%]"> Штрих-код</p>
        </Link>
      </div>
      <div className="p-1 w-full">
        <Link
          to={`/qr-code-report?type=qrcode&link=partiya/${id}`}
          className="flex h-full border-border cursor-pointer hover:bg-background active:bg-transparent text-center  border-dashed border items-center justify-center flex-col gap-2 p-5 pb-4 w-full"
        >
          <QRBoxIcons />
          <p className="text-primary text-[12px] leading-[100%]"> QR код</p>
        </Link>
      </div>
    </div>
  );
}
