import { Loader } from "lucide-react";
import {  useQueryState } from "nuqs";
import { useFormContext } from "react-hook-form";

import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import FormTextInput from "@/components/forms/FormTextInput";
import { Button } from "@/components/ui/button";

export default function FormContent({isPending}:{isPending:boolean}) {

  const [barcode] = useQueryState("barcode");
  const { watch, setValue } = useFormContext();
  const isMetric = watch("isMetric");


  return (
    <>
      <div className="grid mt-[23px] grid-cols-2">
        <div className="col-span-2   relative">
          <FormTextInput
            classNameInput="h-[50px] border-border border rounded-b-[0px] bg-background p-2"
            name="code"
            placeholder="code"
            value={watch("code")}
            // disabled={true}
          />
          {/* <Button
            onClick={handleRegenrate}
            type="button"
            className="absolute right-1 top-[8px] "
          >
            <Plus />
            Yaratish
          </Button> */}
        </div>

        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/country"
           classNameChild="p-2 h-[50px]"
          name="country"
          placeholder="country"
          disabled={true}
        />

        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/factory"
          name="factory"
           classNameChild="p-2 h-[50px]"
          placeholder="factory"
          disabled={true}
        />

        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/collection"
          name="collection"
          onlocalChange={(value) => {
            const costomValue = value as unknown as {
              country: {
                id: string;
                title: string;
              };
              factory: {
                id: string;
                title: string;
              };
            };
            setValue("country", {
              value: costomValue?.country?.id,
              label: costomValue?.country?.title,
            });
            setValue("factory", {
              value: costomValue?.factory?.id,
              label: costomValue?.factory?.title,
            });
            setValue("model", {
              value: undefined,
              label: "",
            });
          }}
           classNameChild="p-2 h-[50px]"
          placeholder="collection"
          // disabled={tip !== "переучет" || reportStatus == "closed"}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl={`/model`}
          name="model"
           classNameChild="p-2 h-[50px]"
          placeholder="model"
          // disabled={tip !== "переучет" || reportStatus == "closed"}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          option={[
            { value: "true", label: "Metrli" },
            { value: "false", label: "Donabay" },
          ]}
          name="isMetric"
           classNameChild="p-2 h-[50px]"
          placeholder="isMetric"
          // disabled={tip !== "переучет" || reportStatus == "closed"}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/shape"
          name="shape"
           classNameChild="p-2 h-[50px]"
          placeholder="shape"
          // disabled={tip !== "переучет" || reportStatus == "closed"}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/size"
          name="size"
           classNameChild="p-2 h-[50px]"
          placeholder="size"
          // disabled={tip !== "переучет" || reportStatus == "closed"}
        />
        <FormTextInput
          type="number"
          classNameInput="h-[50px] p-2 rounded-none"
          name="value"
          placeholder={isMetric == "Metrli" ? "Длина" : "count"}
          
          // disabled={tip !== "переучет" || reportStatus == "closed"}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/color"
          name="color"
           classNameChild="p-2 h-[50px]"
          placeholder="color"
          // disabled={tip !== "переучет" || reportStatus == "closed"}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/style"
          name="style"
           classNameChild="p-2 h-[50px]"
          placeholder="style"
          // disabled={tip !== "переучет" || reportStatus == "closed"}
        />
      </div>

      <Button
        className="h-[58px] mt-[20px]  w-full"
        variant={watch("code")? "default": "outline"}
        
        disabled={barcode != "new" && barcode != undefined && isPending}
      >
        {
          isPending?<Loader className="animate-spin"/>:""
        }
        Qo'shish
      </Button>
      {/* <BarcodeQenerat /> */}
    </>
  );
}
