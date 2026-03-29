import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import useDebounce from "@/hooks/useDebounce";
import { useBarCodeById } from "@/pages/re-register/form/actions.ts";

import { CropFormType, CropSchema } from "../re-register/form/schema";
import Content from "./content";

export default function ProductCheckPage() {
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
  const [, setBarcodeId] = useQueryState("bar_code_id");
  const brcode = form.watch("code");

  const Iid =  useDebounce<string>( brcode, 500) ;
  const { data: qrBaseOne } = useBarCodeById({
    id: Iid,
  });

  // useEffect(() => {
  //   const urlId = id;
  //   if(brcode === '' && urlId) {
  //     setSearchParams({})
  //   }

  // }, [brcode]);

  useEffect(() => {
    if (brcode && qrBaseOne) {
      form.reset({
        code: qrBaseOne?.code || "",
        // isMetric:qrBaseOne?.isMetric ? "Метражный":"Штучный",
        // id: qrBaseOne?.id || "",
        country: {
          value: qrBaseOne?.country?.id as string | undefined,
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
      });
      setBarcodeId(qrBaseOne.id);
    }
  }, [qrBaseOne]);
  return (
    <>
      <FormProvider {...form}>
        <form className="w-full h-full">
          <Content />
        </form>
      </FormProvider>
    </>
  );
}
