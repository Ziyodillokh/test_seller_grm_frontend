import { format } from "date-fns";
import { useMemo } from "react";

import { ProductsData } from "@/pages/hame/type.ts";

interface ICheckList {
  title: string;
  data: ProductsData[];
  username: string;
  address: string;
  isclient?: boolean;
}
export default function CheckList({
  title,
  data,
  username,
  address,
  isclient = false,
}: ICheckList) {
  const total: number = useMemo(() => {
    const totalPrice = data?.reduce((acc, el) => {
      if (isclient) {
        return acc + Number(el?.price);
      }
      if (el?.product?.bar_code?.isMetric) {
        return (
          acc +
          (el?.product?.bar_code?.size?.x || 0) *
            (el?.x / 100) *
            (el?.product?.bar_code?.collection?.collection_prices?.[0]
              ?.priceMeter || 0)
        );
      } else {
        return (
          acc +
          el?.x *
            (el?.product?.bar_code?.size?.x || 0) *
            (el?.product?.bar_code?.size?.y || 0) *
            (el?.product?.bar_code?.collection?.collection_prices?.[0]
              ?.priceMeter || 0)
        );
      }
    }, 0);
    return totalPrice;
  }, [data]);

  return (
    <div className="w-full shadow  pb-20 p-5 rounded-[12px] mt-[22px] ">
      <h3 className="text-center text-primary font-bold text-[21px]">
        {title}
      </h3>
      <p className="text-primary text-center text-[13px] ">
        {format(new Date(), "EEE, MMM d, yyyy • HH:mm")}
      </p>
      <div className="flex items-center text-primary border-primary border-dashed border-b text-[15px] mt-[9px] pb-4 justify-between">
        <p className="text-[10px]">Способ оплаты</p>
        <p className="text-[10px]">Терминал, Наличие</p>
      </div>
      <ul>
        {data &&
          data?.map((el: ProductsData) => (
            <li
              key={el.id}
              className="flex items-center text-primary text-[10px] mt-[14px] mb-[9px]  "
            >
              <p className="w-full">
                {el?.product?.bar_code?.collection?.title ?? ""}
              </p>
              <p className="w-full text-end">
                {el?.product?.bar_code?.size?.title}
              </p>
              <p className="w-full text-end">
                {el?.x} {!el?.product?.bar_code?.isMetric && "x"}
              </p>
             {!isclient && <p className="w-full text-end">
                {
                  el?.product?.bar_code?.collection?.collection_prices?.[0]
                    ?.priceMeter
                }
                $
              </p>}
              {isclient ? (
               <p className="w-full text-end">{ el?.price}</p>
              ) : el?.product?.bar_code?.isMetric ? (
                <p className="w-full text-end">
                  {Number(
                    (((el?.product?.bar_code?.size?.x || 0) * el?.x) / 100) *
                      el?.product?.bar_code?.collection?.collection_prices?.[0]
                        ?.priceMeter || 0
                  )?.toFixed(2)}
                  $
                </p>
              ) : (
                <p className="w-full text-end">
                  {Number(
                    el?.x *
                      (el?.product?.bar_code?.size?.x || 0) *
                      (el?.product?.bar_code?.size?.y || 0) *
                      (el?.product?.bar_code?.collection?.collection_prices?.[0]
                        ?.priceMeter || 0)
                  ).toFixed(2)}
                  $
                </p>
              )}
            </li>
          ))}
      </ul>
      <div className="flex items-center text-primary font-bold text-[12px] mt-[19px] pb-2 justify-between">
        <p>Итого</p>
        <p>{total?.toFixed(2)} $</p>
      </div>
      <ul className="border-primary border-dashed border-y  pt-[11px] pb-[24px]">
        <li className="flex items-center text-primary text-[10px] mt-[14px] mb-[9px]  ">
          <p className="w-full">Продавец:</p>
          <p className="w-full text-end">{username}</p>
        </li>
        <li className="flex items-center text-primary text-[10px]  mb-[9px]">
          <p className="w-full">Адресс:</p>
          <p className="w-full text-nowrap text-end">{address}</p>
        </li>
      </ul>

      <p className="text-[8px] font-light mt-[10px] ">
        Мы благодарим вас за покупку ковра в нашем магазине. Пусть ваш новый
        приобретенный товар приносит вам радость и уют в ваш дом!
      </p>
    </div>
  );
}
