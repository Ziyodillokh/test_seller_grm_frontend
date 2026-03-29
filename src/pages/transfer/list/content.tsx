import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import BasketCard from "@/components/cards/basket-card";
import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import { Button } from "@/components/ui/button";
import { DeleteData, incrementData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";
import { useMeStore } from "@/store/me-store";

import { ProductsData } from "../type";
import { BusketSchema, BusketSchemaType } from "./schema";

export default function Content({ data }: { data: ProductsData[] }) {
  const navigate = useNavigate();
  const { meUser } = useMeStore();
  const [loading, setLoading] = useState(false);
  const form = useForm<BusketSchemaType>({
    resolver: zodResolver(BusketSchema),
    defaultValues: {
      to: {
        value: "",
        label: "",
      },
      from: {
        value: meUser?.filial?.id || "",
        label: meUser?.filial?.title || "",
      },
      user: {
        value: "",
        label: "",
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
    setLoading(true);
    const body = {
      to: form?.watch("to.value"),
      from: form?.watch("from.value"),
      courier: form?.watch("user.value"),
    };
    api
      .post("/transfer/basket", body)
      .then(() => {
        toast.success("Отправлено успешно");

        navigate("/");
        setLoading(false);
      })
      .catch(() => {
        toast.error("Не удалось отправить");
        setLoading(false);
      });
  };
  return (
    <div className="px-2.5 pb-[130px] mt-[22px] border-border ">
      <FormProvider {...form}>
        <form className="grid row-start  mb-[20px] mt-[23px] lg:grid-cols-2">
          <FormComboboxDemoInput
            fieldNames={{ value: "id", label: "title" }}
            fetchUrl="/filial"
            name="from"
            disabled={true}
            classNameChild="p-2 rounded-tl-[12px]"
            className="rounded-2xl"
            placeholder="Филиал"
          />
          <FormComboboxDemoInput
            fieldNames={{ value: "id", label: "title" }}
            fetchUrl="/filial"
            classNameChild="p-2 rounded-tr-[12px]"
            name="to"
            onlocalChange={(e) => {
              if (e.value != meUser?.filial?.id) {
                form.setValue("to", e )
                form.setValue("user", {
                  value: "",
                  label: "",
                } )
              };
            }}
            placeholder="Филиал"
          />
          <FormComboboxDemoInput
            fieldNames={{ value: "id", label: "firstName" }}
            fetchUrl="/user"
            className="col-span-2"
            queries={{
              filial: form?.watch("to.value"),
            }}
            disabled={!form?.watch("to.value")}
            name="user"
            placeholder="Курьер"
            classNameChild="p-2 rounded-b-[12px]"
          />
        </form>
      </FormProvider>
      {data?.length
        ? data?.map((items) => (
            <BasketCard
              onDelete={() => deleteMutation.mutate(items?.id)}
              key={items?.id}
              className="mb-[5px]"
              x={items?.x}
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
     <div className="w-full bg-background flex justify-center px-2.5 py-[21px] shadow-[0_-4px_6px_rgba(0,0,0,0.1)] fixed bottom-0 left-0 ">

      <Button
        onClick={
          loading
            ? () => {}
            :sendTransfer
        }
        disabled={loading}
        className=" max-w-[500px] rounded-[12px] h-12 text-center w-full"
      >
        {loading ? <Loader className="animate-spin" /> : ""} Отправить
      </Button>
     </div>
    </div>
  );
}
