import { useState } from "react";
import QrReader from "react-qr-barcode-scanner";
import { useNavigate } from "react-router-dom";

import { Button } from "./ui/button";
interface  ICodeProps{
  type:string
  link:string
}
const CodeScanner= (props:ICodeProps) => {
  const {type,link} = props
  const navigate = useNavigate()
  const [ qrData,setBarCode] = useState('')


  return (
        <div className="relative w-full max-w-md mx-auto aspect-video">
          { // @ts-expect-error eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/ban-ts-comment
              <QrReader
                onUpdate={(_, result) => {
                  if (result) {
                    setBarCode((result as unknown as {text:string }).text)
                  }
                }}
                
                videoConstraints={{ facingMode: "environment" }}
              />
        }
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`relative ${type == "barcode"? "w-60 h-30":"w-40 h-40"}`}>
          <div className={`absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 ${qrData? 'border-green-500':'border-orange-500'} rounded-sm`} />
          <div className={`absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 ${qrData? 'border-green-500':'border-orange-500'} rounded-sm`} />
          <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 ${qrData? 'border-green-500':'border-orange-500'} rounded-sm`} />
          <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 ${qrData? 'border-green-500':'border-orange-500'} rounded-sm`} />
        </div>
      </div>
      {qrData && (
        <Button onClick={()=>{
          navigate(`/${link}?id=`+qrData)
        }} className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-2 rounded-md text-center text-lg font-semibold shadow-md">
          {qrData}
        </Button>
      )}
        </div>
  );
};

export default CodeScanner;
