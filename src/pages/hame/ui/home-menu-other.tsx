import { Link } from "react-router-dom";

export default function HomeMenuOthere() {
  return (
    <div className={`flex  gap-2.5 mx-4 mt-[17px]`}>
      <Link to={'/new-qr-code'} className="w-full  relative rounded-[22px] overflow-hidden flex items-end bg-card p-[15px] pt-[40px]">
        <img
          className="absolute -bottom-2 right-0"
          width={149}
          height={157}
          src="/images/branding-stickers.png"
          alt="qr-code"
        />
        <p className="text-[15px] z-3 rounded-[8px] font-bold line-[21px] bg-background w-[70%] inline-block shadow p-1.5">
          QR-kod biriktirish
        </p>
      </Link>

      <div className="w-full">
        <div className="flex gap-4 mb-4">
          <Link
            to={`/qr-code?type=qrcode&link=home`}
            className="w-1/2 h-20 inline-block"
          >
            <img
              width={80}
              height={80}
              className="h-[80px]"
              src="/images/qr_costom.png"
            />
          </Link>
          <Link
            to={`/qr-code?type=qrcode&link=home`}
            className={`flex rounded-[16px] w-1/2 bg-[#FF8165] items-center justify-center p-[18px]`}
          >
            <img width={44} height={42} src="/images/scaner.png" />
          </Link>
        </div>
        <Link to={'/partiya'} className="rounded-[22px] inline-block relative w-full p-4 bg-card">
          <p className="px-2 py-2.5 bg-background text-[13px] font-bold shadow rounded-[7px]">
            Partiya qabul q..
          </p>
          <img className="absolute bottom-0 right-0" width={115} height={60} src="/images/car-big.png" />
          </Link>
        </div>
    </div>
  );
}
