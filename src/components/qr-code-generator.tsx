// import * as React from "react";
import {QRCodeCanvas}  from "qrcode.react";
export  const QRCodeGenerator = ({ productId ,size}:{productId:string,size?:number}) => {
  const qrValue = `${productId}`; // bu yerga product detail URL
  // const qrValue =`http://192.168.10.84:5173/re-report?id=${productId}`; // bu yerga product detail URL

  return (
    <div className="flex flex-col  items-center p-4">
      <QRCodeCanvas value={qrValue} size={size||200} />
      {/*<p className="mt-2 text-sm text-gray-600">Product ID: {productId}</p>*/}
    </div>
  );
};
