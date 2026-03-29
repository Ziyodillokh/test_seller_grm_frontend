import { useFormContext } from "react-hook-form";

import { LoadingTerminal } from "../../public/icons";

const ProductHistoriy=() => {

  const form = useFormContext();
  const watchFile = form.watch();
  return(
    <div className='bg-black  mt-[46px]'>
      <div className='text-[#E0DFD6] text-opacity-[0.6] flex items-center gap-2 p-2 border border-b-[1px]'>
        <LoadingTerminal/>
        <p>Исходные данные и история продукта</p>
      </div>

      <div className='text-[#00FF19]'>
        {watchFile && <div className='p-5'>
           <p>Файл: Ghetaran_1200_12.02.2024.xlxs  download</p>
           <p className='mt-4'>Партия:  Iran, Gheteran, 2-partiya</p>
           <p>Дата создание: 01.01.2025</p>
           <p className='mt-4'>Штрих код: {watchFile?.code}</p>
           <p>Серия: 129830123</p>
           <p>Коллекция:  {watchFile?.collection?.label}</p>
           <p>Модель: {watchFile?.model?.label}</p>
           <p>Размер: {watchFile?.size?.label}</p>
           <p>Тип-ковра: {watchFile?.isMetric}</p>
           <p>Форма: {watchFile?.shape?.label}</p>
           <p>Цвет: {watchFile?.color?.label}</p>
           <p>Стиль: {watchFile?.style?.label}</p>
           <p>Количество: {watchFile?.count}</p>
           <p>Цена в продаже:  {watchFile?.color?.label}</p>
           <p className='mt-4'>Генерация Barcode or QR-код: ссылка</p>
           <p className='mt-4'>1 Трансфер: Склад {'->'}  Aloqa</p>
           <p>2 Трансфер: Aloqa {'->'}  Labzak</p>
           <p className='mt-4'>Возврат от продажы: 12.02.2025</p>
           <p className='my-4'>Внесен измимения в: 12.02.2025</p>
         </div>}

      </div>
    </div>
  )
}


export  default  ProductHistoriy