import { Link } from "react-router-dom";

interface IProps {
  link: string;
  type?: string;
  qrCodeText?: string;
  showBarcode?: string;
  className?: string;
}
export default function QrTabs(props: IProps) {
  const { link } = props;

  return (
    <Link
      to={`/qr-code?type=${props?.type || "qrcode"}&link=${link}`}
      className={`flex rounded-[22px] w-full bg-[#FFD700] items-center justify-center py-9 px-10 ${props?.className && props?.className}`}
    >
      <img width={94} src="/images/scaner.png" />
    </Link>
  );
}
