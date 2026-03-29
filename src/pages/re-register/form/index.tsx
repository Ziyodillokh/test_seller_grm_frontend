import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {  useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

import Page from "../table";
import { useBarCodeById, useProdcutCheck } from "./actions";
import FormContent from "./content";
import { CropFormType, CropSchema } from "./schema";
import TopMenu from "./top-menu";

const ActionPage = () => {
  const { meUser } = useMeStore();
  const form = useForm<CropFormType>({
    resolver: zodResolver(CropSchema),
    defaultValues: {
      country: {
        value: undefined,
        label: "",
      },
      collection: {
        value: undefined,
        label: "",
      },
      size: {
        value: undefined,
        label: "",
      },
      shape: {
        value: undefined,
        label: "",
      },
      style: {
        value: undefined,
        label: "",
      },
      color: {
        value: undefined,
        label: "",
      },
      model: {
        value: undefined,
        label: "",
      },
    },
  });
  const [type] = useQueryState("tab",parseAsString.withDefault("переучет"));
  const [id, setId] = useQueryState("id");
  const resetForm = () => {
    form.reset({
      code: "",
      isMetric: {
        value: "",
        label: "",
      },
      value: 0,
      country: {
        value: "",
        label: "",
      },
      collection: {
        value: "",
        label: "",
      },
      size: {
        value: "",
        label: "",
      },
      shape: {
        value: "",
        label: "",
      },
      style: {
        value: "",
        label: "",
      },
      color: {
        value: "",
        label: "",
      },
      model: {
        value: "",
        label: "",
      },
    });
  };

  // const [, setTab] = useQueryState("tab");
  const brcode = form.watch("code");
  const [getSearchParams] = useSearchParams();

  useEffect(() => {
    form.setValue("code", id || "");
  }, [id]);


  const { data: qrBaseOne } = useBarCodeById({
    id: brcode || getSearchParams?.get("id") || undefined,
  });
  const queryClient = useQueryClient();

  const { mutate,isPending } = useProdcutCheck({
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: [apiRoutes.productReport] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reportProductRemaining] });
      
      setId("");
      toast.success("Продукт добавлено успешно!");
    },
  });

  useEffect(() => {
    if (!brcode && !id) {
      resetForm()
    }
  }, [brcode]);

  useEffect(() => {
    if (qrBaseOne) {
      form.reset({
        code: qrBaseOne?.code || "",
        isMetric: {
          value: qrBaseOne?.isMetric ? "true" : "false",
          label: qrBaseOne?.isMetric ? "Метражный" : "Штучный",
        },
        value:  qrBaseOne?.isMetric?   0:1,
        country: {
          value: qrBaseOne?.country?.id,
          label: qrBaseOne?.country?.title,
        },
        collection: {
          value: qrBaseOne?.collection?.id,
          label: qrBaseOne?.collection?.title,
        },
        size: {
          value: qrBaseOne?.size?.id,
          label: qrBaseOne?.size?.title,
        },
        shape: {
          value: qrBaseOne?.shape?.id,
          label: qrBaseOne?.shape?.title,
        },
        style: {
          value: qrBaseOne?.style?.id,
          label: qrBaseOne?.style?.title,
        },
        color: {
          value: qrBaseOne?.color?.id,
          label: qrBaseOne?.color?.title,
        },
        model: {
          value: qrBaseOne?.model?.id,
          label: qrBaseOne?.model?.title,
        },
        factory: {
          value: qrBaseOne?.factory?.id,
          label: qrBaseOne?.factory?.title,
        },
      });
    }
  }, [qrBaseOne]);

  return (
    <>
    <TopMenu/>

  {type =="переучет" ?  <FormProvider {...form}>
      <form
        className="w-full px-2.5 h-full"
        onSubmit={form.handleSubmit((data) => {
          // mutate({ data: { bar_code: qrBaseOne?.id || "", y: data?.count } });

          mutate({
            // id: id || undefined,
            id:  undefined,
            isUpdate: brcode == "new" || brcode == undefined ? false : true,
            data: {
              // filialReportId: filialReportId || "",
              filialId: meUser?.filial?.id ,
              ...data,
            },
          });
        })}
      >

        <FormContent isPending={isPending} />
      </form>
    </FormProvider>:""}

    <Page/>
    </>
  );
};

export default ActionPage;
