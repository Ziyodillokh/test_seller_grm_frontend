import {  useQueryState } from "nuqs";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import BarcodeQenerat from "@/components/barcode-generat";
import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import FormTextInput from "@/components/forms/FormTextInput";
import { Button } from "@/components/ui/button";


export default function FormContent() {

  const [editble] = useState<boolean>(true);
  const [barcode] = useQueryState("barcode");
  const { watch } = useFormContext();
  const isMetric = watch("isMetric");

  return (
    <div className="w-full max-h-[calc(100vh-66px)] scrollCastom  ">
      <div className="grid row-start  px-[16px] py-[20px]  grid-cols-2">
        <FormTextInput
        className="col-span-2"
          classNameInput="h-[56px] w-full border-border border rounded-b-[0px]  bg-background p-2"
          name="code"
          placeholder="code"
          // label="code"
        />
        
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/country"
          classNameChild=" p-2"
          name="country"
          placeholder="country"
          // label="country"
          disabled={true}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/factory"
          name="factory"
          classNameChild=" p-2"
          placeholder="Factory"
          // label="factory"
          disabled={true}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/collection"
          name="collection"
          disabled={true}
          classNameChild=" p-2"
          placeholder="collection"
          // label="collection"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl={`/model`}
          name="model"
          disabled={true}
          classNameChild=" p-2"
          placeholder="model"
          // label="model"
        />
      
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/shape"
          name="shape"
          disabled={true}
          classNameChild=" p-2"
          placeholder="shape"
          // label="shape"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/size"
          name="size"
          disabled={true}
          classNameChild=" p-2"
          placeholder="size"
          // label="size"
        />
           <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/style"
          name="style"
          classNameChild=" p-2"
          placeholder="style"
          disabled={true}
          // label="style"
        /> 
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/color"
          name="color"
          classNameChild=" p-2"
          placeholder="color"
          disabled={true}
          // label="color"
        />
    
          <FormTextInput
          classNameInput="h-[56px] border-border border  rounded-[0px] bg-background p-2"
          name="isMetric"
          placeholder="isMetric"
          disabled={true}
          // label="isMetric"
        />
      <FormTextInput
          type="number"
           classNameInput="h-[56px] border-border border  rounded-[0px] bg-background p-2"
          name="count"
          placeholder={isMetric == "Метражный" ? "Длина" : "count"}
          disabled={!editble}
          // label={isMetric == "Метражный" ? "Длина" : "count"}
        />
        <Button
          className="col-span-2 h-[56px] rounded-t-[0px]"
          disabled={barcode != "new" && barcode != undefined}
        >
          Добавить
        </Button>
      </div>
      <BarcodeQenerat />
    </div>
  );
}
