import { useFormContext } from "react-hook-form";

import { LoadingTerminal } from "../../public/icons";

const ProductHistoriy=() => {

  const form = useFormContext();
  const watchFile = form.watch();
  return(
    <div className='bg-black  mt-[46px]'>
      <div className='text-[#E0DFD6] text-opacity-[0.6] flex items-center gap-2 p-2 border border-b-[1px]'>
        <LoadingTerminal/>
        <p>Asl ma'lumotlar va mahsulot tarixi</p>
      </div>

      <div className='text-[#00FF19]'>
        {watchFile && <div className='p-5'>
           <p>Fayl: Ghetaran_1200_12.02.2024.xlxs  download</p>
           <p className='mt-4'>Partiya:  Iran, Gheteran, 2-partiya</p>
           <p>Yaratilgan sana: 01.01.2025</p>
           <p className='mt-4'>Shtrix kod: {watchFile?.code}</p>
           <p>Seriya: 129830123</p>
           <p>Kolleksiya:  {watchFile?.collection?.label}</p>
           <p>Model: {watchFile?.model?.label}</p>
           <p>O'lcham: {watchFile?.size?.label}</p>
           <p>Tip: {watchFile?.isMetric}</p>
           <p>Shakl: {watchFile?.shape?.label}</p>
           <p>Rang: {watchFile?.color?.label}</p>
           <p>Stil: {watchFile?.style?.label}</p>
           <p>Soni: {watchFile?.count}</p>
           <p>Sotuv narxi:  {watchFile?.color?.label}</p>
           <p className='mt-4'>Barcode/QR kod yaratish: havola</p>
           <p className='mt-4'>1 Transfer: Ombor {'->'}  Aloqa</p>
           <p>2 Transfer: Aloqa {'->'}  Labzak</p>
           <p className='mt-4'>Sotuvdan qaytarish: 12.02.2025</p>
           <p className='my-4'>O'zgartirish kiritildi: 12.02.2025</p>
         </div>}

      </div>
    </div>
  )
}


export  default  ProductHistoriy