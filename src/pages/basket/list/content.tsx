import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import BasketCard from "@/components/cards/basket-card";
import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import { Button } from "@/components/ui/button";
// import QrTabs from "@/pages/hame/ui/qr-tabs";
import { DeleteData, incrementData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";
import { useMeStore } from "@/store/me-store";

import { ProductsData } from "../type";
import { BusketSchema, BusketSchemaType } from "./schema";

export default function Content({ data }: { data: ProductsData[] }) {
  const navigate = useNavigate();
  const { meUser } = useMeStore();
  const form = useForm<BusketSchemaType>({
    resolver: zodResolver(BusketSchema),
    defaultValues: {
      to: {
        value: "",
        label: "",
      },
      from: {
        value:  meUser?.filial?.id || "",
        label:  meUser?.filial?.title || "",
      },
    },
  });

  const QueryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await DeleteData(apiRoutes.orderBasket, id);
    },
    onSuccess: () => {
      toast.success("Удалено");
      QueryClient.invalidateQueries({ queryKey: [apiRoutes.orderBasket] });
      QueryClient.invalidateQueries({ queryKey: [apiRoutes.orderBasketCounts] });
    },
  });

  const incrementMutation = useMutation({
    mutationFn: async ({ id, x }: { id: string; x: number }) => {
      return await incrementData(apiRoutes.orderBasket, id, x);
    },
    onSuccess: () => {
      toast.success("Обновлено");
      QueryClient.invalidateQueries({ queryKey: [apiRoutes.orderBasket] });
    },
  });

  const sendTransfer = () => {
    const body: object = {
      to: form?.watch('to.value'),
      from: form?.watch('from.value'),
      // count: item?.isMetric ? item?.product.y * 100 : item?.product?.count,
      // product: item.id,
    }
      api
        .post("/transfer", body)
        .then(() => {
          toast.success("Отправлено успешно");
          navigate("/");
        })
        .catch(() => toast.error("Не удалось отправить"));
  };
  
  return (
    <div className=" relative  mb-[110px]  pb-[1px] ">

   { meUser?.position?.role == 0 || meUser?.position?.role == 7 &&   <FormProvider {...form}>
        <form className="grid row-start px-2.5   mb-[20px] mt-[23px] grid-cols-2" >
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/filial"
          name="from"
          label="Откуда"
          disabled={true}
          classNameChild="p-2"
          placeholder="Филиал"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/filial"
          name="to"
          label="Куда"
          classNameChild="p-2"
          placeholder="Филиал"
        />
         
        </form>
        </FormProvider>}
      {/* <QrTabs  qrCodeText="Отсканируйте штрих-код или QR-код." showBarcode="" type="busket" link={"basket"} /> */}
    
     <div  className="mt-5.5 px-2.5">
     {data?.length
        ? data?.map((items) => (
            <BasketCard
              onDelete={() => deleteMutation.mutate(items?.id)}
              key={items?.id}
              className="mb-[5px]"
              x={
                items?.x
              }
              model={items?.product?.bar_code?.model?.title}
              colaction={items?.product?.bar_code?.collection?.title}
              price={
                items?.product?.bar_code?.collection?.collection_prices?.[0]
                  ?.priceMeter || 0
              }
              color={items?.product?.bar_code?.color?.title}
              shape={items?.product?.bar_code?.shape?.title}
              size={items?.product?.bar_code?.size?.title}
              max={
                items?.isMetric ? items?.product.y * 100 : items?.product?.count
              }
              type={items?.isMetric ? "Метражный" : "Штучный"}
              handleCount={(value: number) =>
                incrementMutation.mutate({ id: items?.id, x: value })
              }
            />
          ))
        : null}
     </div>

     <div className="w-full bg-background flex justify-center px-2.5 py-[21px] shadow-[0_-4px_6px_rgba(0,0,0,0.1)] fixed bottom-0 left-0 "> 
     <Button
        onClick={ () =>{
          if(meUser?.position?.role == 0 || meUser?.position?.role == 7 ){
            sendTransfer()
          }else{
            navigate("/basket/check")
          }
          }}
        className="rounded-[12px] max-w-[500px] h-12 text-center w-full"
      >
       { meUser?.position?.role == 0 || meUser?.position?.role == 7 ? "Отправить":"Оформить"} 
      </Button>
     </div>
    </div>
  );
}
