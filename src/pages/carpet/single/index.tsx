import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
// import { useQueryState } from "nuqs";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import CounInput from "@/components/coun-input";
import { BusketIcons } from "@/components/icons";
import { QRCodeGenerator } from "@/components/qr-code-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UploadFile } from "@/components/UploadFile";
import useOrderBasket from "@/pages/hame/action";
import BronsModals from "@/pages/hame/ui/modals.tsx";
import { UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

import useCountChange from "../action";
import useProductId from "../queries";

export default function CarpetSinglePage() {
  const { id } = useParams();
  const [value, setValue] = useState<number | undefined>(1);
  const [isPartiya] = useQueryState("isPartiya",parseAsBoolean);
  const { data } = useProductId({
     id: id || "",
     isPartiya: isPartiya || false,
     });

  const queryClient = useQueryClient();
  const { meUser } = useMeStore();
  const [type] = useQueryState("tab");

  
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();
  // const [ ,setCarpetType] = useQueryState("carpetType");
  // const [ ,setId] = useQueryState("Id");
  const { mutate } = useOrderBasket({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.orderBasket] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.orderBasketCounts] });
      
      toast.success("Продукт добавлено успешно!");
      window.location.replace(import.meta.env.BASE_URL + "home");
    },
  });
  const { mutate: countMutate ,isPending:CountPending } = useCountChange({
    onSuccess: () => {
      if (isDelete) {
        toast.success("Продукт удалено успешно!");
        navigate("/re-report/list");
      } else {
        toast.success("количество изменено успешно!");
        queryClient.invalidateQueries({ queryKey: [apiRoutes.product] });
      }
    },
  });

  const count = useMemo(() => {
    const value = (data?.bar_code?.isMetric && type == "остаток")
      ? Number((data?.y * 100).toFixed())
      : type === "переучет"
        ? data?.check_count
        : type === "дефицит"
          ? (data?.count || 0) - (data?.check_count || 0)
          : type === "излишки"
            ? (data?.check_count || 0) - (data?.count || 0)
            : data?.count;
    setValue(value);
    return value;
  }, [type, data]);


  const { mutate:productMutate } = useMutation({
    mutationFn: async (uuid: string) => {
      return await UpdatePatchData(apiRoutes.product, id|| "", {
        imgUrl: uuid,
      });
    },
    onSuccess: () => {
      toast.success(" Изображение успешно изменен");
    },
  });
  return (
    <div className="w-full mt-4 px-4">
     
    <UploadFile localPropsUrl={data?.bar_code?.imgUrl?.path || undefined} type="products" getUploadValue={(uuid)=>{
      productMutate(uuid)
      }}/>
     
      <div className="my-4 rounded-[12px] mb-[35px] border-border border">
        <div className="flex w-full items-center px-[17px] border-b border-border py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Коллекция:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {data?.bar_code?.collection?.title}
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Модель:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {data?.bar_code?.model?.title}
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Размер:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {data?.bar_code?.size?.title}
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Объём:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {(Number(data?.bar_code?.size?.x) * Number(data?.y)).toFixed(2)}м²
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Цена:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {data?.bar_code?.collection?.collection_prices?.[0]?.priceMeter}$
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-[#FF7700]">
            Цена объёма:
          </p>
          <p className="w-full text-[16px] font-medium text-[#FF7700]">
            {(
              Number(data?.bar_code?.size?.x) *
              (data?.bar_code?.collection?.collection_prices?.[0]?.priceMeter ||
                0) * Number(data?.y)
            ).toFixed(2)}
            $
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Тип-ковра:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {data?.bar_code?.isMetric ? "Метражный" : "Штучный"}
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            {data?.bar_code?.isMetric ? "Длина:" : "Количество:"}
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {count}

            {data?.bar_code?.isMetric ? "" : "шт"}
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Форма:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {data?.bar_code?.shape?.title}{" "}
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Цвет:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {data?.bar_code?.color?.title}{" "}
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Стиль:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {data?.bar_code?.style?.title}{" "}
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Страна:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {data?.bar_code?.country?.title}
          </p>
        </div>
        <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Поставщик:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
            {data?.bar_code?.factory?.title}
          </p>
        </div>
       <div className="flex w-full items-center px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Партия:
          </p>
          <p className="w-full text-[16px] font-medium text-primary">
          {data?.partiya
              ? data?.partiya.title + " " + data?.partiya?.partiya_no?.title
              : data?.bar_code?.partiya_title || data?.partiya_title}
          </p>
        </div>
        <div className="flex w-full items-start px-[17px] py-3">
          <p className="w-full text-[16px] font-medium text-primary/60">
            Штрих-код:
          </p>
          <div className="text-start w-full items-start flex flex-col justify-start">
          <p className="w-full text-[16px] font-medium text-primary">
          {data?.bar_code?.code}
          </p>
           {data?.bar_code?.code? <QRCodeGenerator  productId={data?.bar_code?.code} size={40}/> :""}
          </div>
        </div>
      </div>

      {meUser?.position?.role == 2 && !type ? (
        <>
          <Button
            onClick={() => {
              mutate({
                qr_code: undefined,
                product: data?.id,
                x: data?.bar_code?.isMetric ? data?.y * 100 : 1,
                isMetric: data?.bar_code?.isMetric || false,
              });
              // setCarpetType( data?.bar_code?.isMetric ?'Метражный': 'Штучный')
              // setId(data?.id||"")
            }}
            className="h-[56px] flex items-center justify-center gap-1   w-full mt-2 mb-12"
          >
            <BusketIcons />
            Добавить в корзину
          </Button>
        </>
      ) : (
        ""
      )}
      {type ? (
        <>
          {data?.bar_code?.isMetric ? (
            <Input
              type="number"
              defaultValue={count}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder="sm"
              className="bg-card text-[22px] max-w-[120px] mx-auto py-[10px] h-[50px] pl-5 pr-[15px] rounded-lg"
            />
          ) : (
            <CounInput count={value || 0} setCount={setValue} />
          )}

          <Popover>
            <PopoverTrigger asChild>
              <p className="text-center text-[#F57457]  cursor-pointer text-[14px] mt-[32px] mb-[24px]">
                Удалить продукт
              </p>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <p>Вы действительно хотите Удалить продукт?</p>
              <div className="flex justify-end gap-2 mt-2">
                <PopoverClose>
                  <Button variant={"outline"}>Отмена</Button>
                </PopoverClose>
                <Button
                  className="bg-[#F57457]"
                  onClick={() => {
                    if(!CountPending){
                      setIsDelete(true);
                      countMutate({
                        data: {
                          count: type != "переучет"? 0:  undefined,
                          check_count: type == "переучет"? 0:  undefined,
                          
                        },
                        id: data?.id || "",
                      });
                    }
                  }}
                >
                  Удалить
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={() => {
              setIsDelete(false);
              countMutate({
                data: {
                  count:( data?.bar_code?.isMetric || type === "переучет") ? undefined : value,
                  check_count: type != "переучет"|| data?.bar_code?.isMetric ? undefined : value,
                  y:
                    data?.bar_code?.isMetric && value ? value / 100 : undefined,
                },
                id: data?.id || "",
              });
            }}
            className="h-[48px  flex items-center mx-auto justify-center gap-1 rounded-[12px] w-full max-w-[336px]  mt-2 mb-12"
          >
            сохранить
          </Button>
        </>
      ) : (
        ""
      )}

      <BronsModals />
    </div>
  );
}
