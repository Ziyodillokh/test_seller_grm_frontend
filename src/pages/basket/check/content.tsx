import { Label } from "@radix-ui/react-label";
import { Banknote, CreditCard, Loader } from "lucide-react";
import { useMemo, useState } from "react";

import CheckList from "@/components/check";
import { PercentIcons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TData } from "@/pages/client/type";
import { ProductsData } from "@/pages/hame/type.ts";
import { IOrderBasked } from "@/service/apiHelpers.ts";
import { useMeStore } from "@/store/me-store.ts";

import ClientList from "./client-list";

interface IContent {
  data: ProductsData[];
  isPending: boolean;
  handleSubmit: ({
    price,
    plasticSum,
    comment,
    isDebt,
    clientId,
  }: {
    price: number;
    plasticSum: number;
    comment: string;
    isDebt?: boolean;
    clientId?: string;
  }) => void;
}

export default function Content({ data, handleSubmit, isPending }: IContent) {
  const { meUser } = useMeStore();
  const [sum, setSum] = useState<IOrderBasked>({ price: 0, plasticSum: 0 });
  const [commit, setCommit] = useState("");
  const [duty, setDuty] = useState<boolean>(false);
  const [dutyValue, setDutyValue] = useState<TData>();

  const total: number = useMemo(() => {
    const totalPrice = data?.reduce((acc, el) => {
      if (el?.isMetric) {
        return (
          acc +
          (el?.product?.bar_code?.size?.x || 0) *
            (el?.x / 100) *
            (el?.product?.bar_code?.collection?.collection_prices?.[0]
              ?.priceMeter || 0)
        );
      } else {
        return (
          acc +
          el?.x *
            (el?.product?.bar_code?.size?.x || 0) *
            (el?.product?.bar_code?.size?.y || 0) *
            (el?.product?.bar_code?.collection?.collection_prices?.[0]
              ?.priceMeter || 0)
        );
      }
    }, 0);
    return totalPrice;
  }, [data]);
  return (
    <>
      <div className=" px-8  py-3 mb-[110px] overflow-hidden  relative">
        <CheckList
          username={meUser?.firstName + " " + meUser?.lastName}
          title={meUser?.filial?.title ?? ""}
          address={meUser?.filial?.address ?? ""}
          data={data}
        />
        <ClientList
          open={duty}
          setOpen={setDuty}
          value={dutyValue}
          setValue={setDutyValue}
        />
        <div className="flex items-center my-[20px] gap-[6px] justify-center w-full ">
          <Switch
            checked={Boolean(dutyValue)}
            onCheckedChange={(e) => {
              setDuty(e);
              setDutyValue(undefined);
            }}
            id="duty"
          />
          <Label
            className="text-primary text-[17px] font-medium"
            htmlFor="duty"
          >
            Продать в долг
          </Label>
        </div>
        {dutyValue && (
          <div
            className={` shadow w-full mb-2.5  p-4 mb- py-2.5 rounded-[12px] `}
          >
            <p className="text-primary text-[14px] font-medium">
              {dutyValue?.fullName}
            </p>
            <p className="pt-[2px] text-[#58A0C6] text-[14px] font-medium">
              {dutyValue?.phone}
            </p>
          </div>
        )}

        <div className="flex w-full   gap-2.5">
          <div className="w-full ">
            <div className="p-4 flex rounded-[12px] mb-2.5 bg-background shadow items-center gap-1">
              <Banknote size={"19px"} />
              {/*<p className="text-primary/40">Наличие</p>*/}
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSum({ ...sum, price: Number(e.target.value) })
                }
                type={"number"}
                min={0}
                className="outline-none w-full no-spinner"
                placeholder={"Наличие"}
              />
            </div>
            <div className="p-4 flex rounded-[12px]  bg-background shadow items-center gap-1">
              <CreditCard size={"18px"} />

              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSum({ ...sum, plasticSum: Number(e.target.value) })
                }
                type={"number"}
                min={0}
                disabled={Boolean(dutyValue)}
                className="outline-none w-full no-spinner"
                placeholder={"Онлайн"}
              />
            </div>
          </div>
          <div className="w-full flex items-center rounded-[12px] justify-center flex-col bg-background shadow text-center p-[21px]">
            <p className="text-primary text-[13px]">Скидка</p>
            <div className="flex text-2xl">
              <b>
                {total
                  ? Math.max(
                      ((total - (sum?.price + sum?.plasticSum)) / total) * 100,
                      0
                    ).toFixed(2)
                  : 0}
              </b>
              <PercentIcons />
            </div>
          </div>
        </div>
        <div className="p-4 mt-2.5  rounded-[12px] bg-background shadow ">
          <textarea
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCommit(e.target.value)
            }
            className="outline-none w-full no-spinner"
            placeholder={"Комментарий"}
          />
        </div>
      </div>
      <div className="w-full bg-background flex justify-center px-2.5 py-[21px] shadow-[0_-4px_6px_rgba(0,0,0,0.1)] fixed bottom-0 left-0 ">
        <Button
          disabled={sum.price + sum.plasticSum === 0 || isPending}
          onClick={
            isPending
              ? () => {}
              : () =>
                {
                    handleSubmit({
                    isDebt: Boolean(dutyValue?.id),
                    clientId: dutyValue?.id,
                    comment: commit,
                    ...sum,
                  })
                }
          }
          className="rounded-[12px] max-w-[500px]  h-12 text-center w-full"
        >
          {isPending ? <Loader className="animate-spin" /> : ""} Продать
        </Button>
      </div>
    </>
  );
}
