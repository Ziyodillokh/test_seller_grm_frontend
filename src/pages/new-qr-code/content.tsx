// import { ScanLine } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import BarcodeQenerat from "@/components/barcode-generat";
import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import FormTextInput from "@/components/forms/FormTextInput";
import { QRCodeGenerator } from "@/components/qr-code-generator";
import { Button } from "@/components/ui/button";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";

import QrTabs from "../hame/ui/qr-tabs";

export default function Content() {
  const navigate = useNavigate();
  const [qrcode, setQrcode] = useState<string | undefined>("");
  const { setValue } = useForm();
  const [id] = useQueryState("id");
  const [type] = useQueryState("type");
  const [bar_code_id] = useQueryState("bar_code_id");
  
  useEffect(() => {
    if (type === "barcode") {
      setValue("bar_code_id", id);
    } else {
      setQrcode(id || undefined);
    }
  }, [type]);

  const handleSaveQR = async () => {
    api
      .put(apiRoutes.qrSave + `/${qrcode}`, { bar_code: bar_code_id })
      .then(() => {
        toast.success("Отправлено успешно");
        navigate("/");
      })
      .catch(() => toast.error("Не удалось отправить"));
  };

  return (
    <div className="w-full border-border px-5 border-r">
      <p className="text-center pt-[30px] text-primary mb-[12px]">
        Отсканируйте продукта
      </p>
      {
        id ? <div className="text-center">
          <div className="p-1.5 text-center bg-white inline-block  m-auto">
             <QRCodeGenerator size={100}  productId={id}/>
             <p>{id}</p>
          </div>
        </div>: <QrTabs showBarcode=""  link={"new-qr-code"} />
      }
     
      <div className="grid row-start  mt-[23px] grid-cols-2">
        <div className="col-span-2 relative">
          <FormTextInput
            classNameInput="h-[56px] p-2 rounded-[0px] border-border border bg-background"
            name="code"
            placeholder="code"
            // disabled={true}
          />
          {/* <Button
            onClick={() => navigate(`/qr-code?type=barcode&link=new-qr-code`)}
            className="absolute right-0.5 top-0.5"
          >
            <ScanLine /> Сканировать
          </Button> */}
        </div>

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
        {/* <FormTextInput
          classNameInput="p-2 h-[42px]"
          name="isMetric"
          placeholder="isMetric"
        /> */}
        <FormTextInput
          type="number"
          classNameInput="p-2 h-[56px] mb-5 rounded-[0px] border-border border bg-backgroun"
          name="count"
          placeholder="count"
        />
      </div>
      <BarcodeQenerat />
      <Button
        type="button"
        onClick={() => handleSaveQR()}
        className="w-full my-3 h-12"
      >
        Сохранить
      </Button>
    </div>
  );
}
