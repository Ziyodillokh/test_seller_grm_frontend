import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {  useParams } from "react-router-dom";
import { toast } from "sonner";

import useDebounce from "@/hooks/useDebounce";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

import Page from "../table";
import { useBarCodeById, useProdcutCheck } from "./actions";
import FormContent from "./content";
import { CropFormType, CropSchema } from "./schema";
import TopMenu from "./top-menu";

const ActionPage = () => {
  const {meUser} = useMeStore()
  const form = useForm<CropFormType>({
    resolver: zodResolver(CropSchema),
    defaultValues: {
      code: "",
      isMetric: "",
      count: 0,
      country: {
        value: undefined,
        label: "",
      },
      factory: {
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

  const [tip] = useQueryState("tip",parseAsString.withDefault(meUser?.position?.role == 7 ? "переучет":"new"));
  const [type] = useQueryState(
    "tab",
    parseAsString.withDefault("переучет")
  );
  const [idLoc] = useQueryState("id");
  const { id } = useParams();

  const resetForm = () => {
    form.reset({
      code: "",
      isMetric: "",
      count: 0,
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
  }

  useEffect(() => {
    resetForm()
    
  }, [tip]);

  useEffect(() => {
    form.setValue("code", idLoc || "");
  }, [idLoc]);

  const brcode = useDebounce(form.watch("code"),500);

  const { data: qrBaseOne } = useBarCodeById({
    id: brcode || idLoc || undefined,
  });
  const queryClient = useQueryClient();

  const { mutate } = useProdcutCheck({
    onSuccess: () => {
      resetForm()
      const codeInput = document.querySelector('input[name="code"]');
      if (codeInput) {
        (codeInput as HTMLInputElement).select();
      }

      queryClient.invalidateQueries({ queryKey: [apiRoutes.excelProducts] })

      if (idLoc == "new") {
        toast.success("Продукт добавлено успешно");
      } else {
        toast.success("Продукт добавлено успешно");
      }
    },
  });

  useEffect(() => {
    if (qrBaseOne) {
      form.reset({
        code: qrBaseOne?.code || "",
        isMetric: qrBaseOne?.isMetric ? "Метражный" : "Штучный",
        count: qrBaseOne?.count || qrBaseOne?.isMetric ? (qrBaseOne?.size?.y|| 0 ) * 100  : 1,
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
    }else{
      resetForm()
    }
  }, [qrBaseOne]);


  return (
    <>
    <TopMenu/> 
    {type =="переучет" ?  <FormProvider {...form}>
      <form
        className="w-full h-full"
        onSubmit={form.handleSubmit((data) => {
          resetForm()
          mutate({
            partiyaId: id || "",
            isUpdate:false,
            data: { code: qrBaseOne?.code || "" , tip: "переучет", y: data?.count },
          });
        })}
      >
        <FormContent />
      </form>
    </FormProvider>:""}
    <Page/>
    </>
  );
};

export default ActionPage;
