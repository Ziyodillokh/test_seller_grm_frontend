import { useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

import CounInput from "@/components/coun-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRoutes } from "@/service/apiRoutes";

import useOrderBasket from "../action";

const MetrComponet = ({
  value,
  setValue,
}: {
  value: number | undefined;
  setValue: Dispatch<SetStateAction<number | undefined>>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Введите объём для продажи!</DialogTitle>
      </DialogHeader>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder="sm"
        className="bg-white text-[22px] py-[17px] h-[62px] pl-5 pr-[15px] rounded-lg"
      />
    </>
  );
};

const RuloComponet = ({
  value,
  setValue,
}: {
  value: number | undefined;
  setValue: Dispatch<SetStateAction<number | undefined>>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Введите количество для продажи!</DialogTitle>
      </DialogHeader>
      {<CounInput count={value || 0} setCount={setValue} />}
    </>
  );
};

const BronedComponet = () => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Этот ковёр уже забронирован!</DialogTitle>
      </DialogHeader>
      <div className="w-full">
        <div className="text-center mb-1 p-3 w-full rounded-lg bg-white ">
          <p className="text-[12px] text-primary">Флиал</p>
          <p className="text-[18px] text-primary">Sanat Hali</p>
        </div>
        <div className="text-center  p-3 w-full rounded-lg bg-white ">
          <p className="text-[12px] text-primary">Флиал</p>
          <p className="text-[18px] text-primary">Sanat Hali</p>
        </div>
      </div>
    </>
  );
};

export default function BronsModals() {
  const [carpetType, setCarpetType] = useQueryState("carpetType");
  const [Id] = useQueryState("Id", parseAsString.withDefault("0"));
  const [value, setValue] = useState<number | undefined>(1);
  const queryClient = useQueryClient();
  const { mutate } = useOrderBasket({
    onSuccess: () => {
      setCarpetType(null);
      setValue(undefined);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.orderBasket] });
      toast.success("Продукт добавлено успешно!");
    },
  });
  return (
    <Dialog onOpenChange={() => setCarpetType(null)} open={Boolean(carpetType)}>
      <DialogContent className="max-w-[300px]">
        {carpetType === "Метражный" && (
          <MetrComponet value={value} setValue={setValue} />
        )}
        {carpetType === "Штучный" && (
          <RuloComponet value={value || 1} setValue={setValue} />
        )}
        {carpetType === "broned" && <BronedComponet />}
        {carpetType != "broned" && (
          <Button
            onClick={() => {
              if (value) {
                mutate({
                  product: Id,
                  x: value,
                  isMetric: carpetType == "Метражный" ? true : false,
                });
              }
            }}
            className="rounded-xl h-[62px] text-[15px]"
          >
            Добавить в корзину
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
