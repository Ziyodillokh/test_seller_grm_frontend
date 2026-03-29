import BarcodeQenerat from "@/components/barcode-generat";
import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import FormTextInput from "@/components/forms/FormTextInput";
import ProductHistoriy from "@/components/product-historiy";

import QrTabs from "../hame/ui/qr-tabs";

export default function Content() {
  return (
    <div className="w-full border-border px-5 border-r">
      <p className="text-center pt-[30px] text-primary mb-[12px]">
        Отсканируйте продукта
      </p>
      <QrTabs  link={"product-check"} />
      <div className="grid row-start  mt-[23px] grid-cols-2">
        <FormTextInput
          classNameInput="h-[56px] bg-bacground rounded-[0px] p-2 border-border border"
          name="code"
          placeholder="code"
          // disabled={true}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/country"
          classNameChild="p-2"
          name="country"
          placeholder="country"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/collection"
          name="collection"
          classNameChild="p-2"
          placeholder="collection"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl={`/model`}
          name="model"
          classNameChild="p-2"
          placeholder="model"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/size"
          name="size"
          classNameChild="p-2"
          placeholder="size"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/shape"
          name="shape"
          classNameChild="p-2"
          placeholder="shape"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/style"
          name="style"
          classNameChild="p-2"
          placeholder="style"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/color"
          name="color"
          classNameChild="p-2"
          placeholder="color"
        />
        <FormTextInput
          classNameInput="p-2 h-[56px] bg-bacground rounded-[0px] border-border border"
          name="isMetric"
          
          placeholder="isMetric"
        />
        <FormTextInput
          type="number"
          classNameInput="p-2 h-[56px] bg-bacground rounded-[0px] border-border border"
          name="count"
          placeholder="count"
        />
      </div>
      <BarcodeQenerat />
      <ProductHistoriy />
    </div>
  );
}
