import { Link } from "react-router-dom";

import { QRBoxIcons, QRSerachIcons } from "@/components/icons";
interface IProps {
  link: string;
  type?:string;
  qrCodeText?: string;
  showBarcode?: string;
}
export default function QrTabs(props: IProps) {
  const { link} = props;

  return (
    <div className="border-border/40 bg-white flex rounded-t-2xl  border-b-0 border">
      {!(props?.showBarcode === "") && (
          <Link
            to={`/qr-code?type=barcode&link=${link}`}
            className="flex border-border/40 text-center border-r py-5  items-center justify-center gap-2 w-full"
          >
            <QRSerachIcons />
            <p className="text-primary text-[12px] leading-[100%]">
              Штрих-код
            </p>
          </Link>
      )}
      <div className="p-1 w-full">
        <Link
          to={`/qr-code?type=${props?.type|| "qrcode"}&link=${link}`}
          className="flex cursor-pointer  text-center  items-center justify-center py-5 gap-2  w-full"
        >
          <QRBoxIcons />
          <p className="text-primary text-[12px] leading-[100%]"> {props?.qrCodeText || "QR код"} </p>
        </Link>
      </div>
    </div>
  );
}
