import { Label } from "@radix-ui/react-label";
import { Banknote, ChevronRight, CreditCard, Loader } from "lucide-react";
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
  handleSubmit: (payload: {
    price: number;
    plasticSum: number;
    comment: string;
    isDebt?: boolean;
    clientId?: string;
    debtAmount?: number;
    isTransfer?: boolean;
    transferRemainder?: number;
  }) => void;
}

export default function Content({ data, handleSubmit, isPending }: IContent) {
  const { meUser } = useMeStore();
  const [sum, setSum] = useState<IOrderBasked>({ price: 0, plasticSum: 0 });
  const [commit, setCommit] = useState("");
  const [duty, setDuty] = useState<boolean>(false);
  const [transferToggle, setTransferToggle] = useState<boolean>(false);
  const [transferRemainder, setTransferRemainder] = useState<number>(0);
  const [clientPickerOpen, setClientPickerOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<TData | undefined>(undefined);

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

  const debtAmount = Math.max(total - (sum.price + sum.plasticSum), 0);
  const showDebtPanel = duty;
  const canSubmit =
    !isPending &&
    !!selectedClient?.id &&
    (
      transferToggle
        ? total > 0
        : duty
          ? debtAmount > 0
          : sum.price + sum.plasticSum >= total && (sum.price + sum.plasticSum) > 0
    );

  return (
    <>
      <div className="px-8 py-3 mb-[110px] overflow-hidden relative">
        <CheckList
          username={meUser?.firstName + " " + meUser?.lastName}
          title={meUser?.filial?.title ?? ""}
          address={meUser?.filial?.address ?? ""}
          data={data}
        />
        <ClientList
          open={clientPickerOpen}
          setOpen={setClientPickerOpen}
          value={selectedClient}
          setValue={setSelectedClient}
        />

        {/* 2 toggle qatori — O'tkazma + Qarzga sotish */}
        <div className="flex items-center justify-around my-[20px] gap-[6px]">
          <div className="flex items-center gap-[6px]">
            <Switch
              checked={transferToggle}
              onCheckedChange={(e) => {
                setTransferToggle(e);
                if (e) setDuty(false);
              }}
              id="transfer"
            />
            <Label className="text-primary text-[15px] font-medium" htmlFor="transfer">
              O'tkazma
            </Label>
          </div>
          <div className="flex items-center gap-[6px]">
            <Switch
              checked={duty}
              onCheckedChange={(e) => {
                setDuty(e);
                if (e) setTransferToggle(false);
              }}
              id="duty"
            />
            <Label className="text-primary text-[15px] font-medium" htmlFor="duty">
              Qarzga sotish
            </Label>
          </div>
        </div>

        {/* Mijoz tanlash — toggle'lar pastida (har doim ko'rinadi) */}
        <div
          onClick={() => setClientPickerOpen(true)}
          className="cursor-pointer mb-2.5 flex items-center justify-between bg-background shadow rounded-[12px] py-3 px-[15px]"
        >
          {selectedClient ? (
            <p className="text-primary text-[14px] font-medium">{selectedClient.fullName}</p>
          ) : (
            <p className="text-primary/50 text-[14px] font-medium">Mijozni tanlang</p>
          )}
          <ChevronRight className="w-[18px] h-[18px] text-primary/60" />
        </div>

        <div className="flex w-full gap-2.5">
          <div className="w-full">
            <div className="p-4 flex rounded-[12px] mb-2.5 bg-background shadow items-center gap-1">
              <Banknote size={"19px"} />
              <input
                value={transferToggle ? total.toFixed(2) : (sum.price || "")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSum({ ...sum, price: Number(e.target.value) })
                }
                type={"number"}
                min={0}
                disabled={transferToggle}
                className="outline-none w-full no-spinner disabled:text-primary/60"
                placeholder={"Naqd"}
              />
            </div>
            <div className="p-4 flex rounded-[12px] bg-background shadow items-center gap-1">
              <CreditCard size={"18px"} />
              <input
                value={transferToggle ? (transferRemainder || "") : (sum.plasticSum || "")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (transferToggle) {
                    setTransferRemainder(Number(e.target.value));
                  } else {
                    setSum({ ...sum, plasticSum: Number(e.target.value) });
                  }
                }}
                type={"number"}
                min={0}
                className="outline-none w-full no-spinner"
                placeholder={transferToggle ? "O'tkazma qoldig'i" : "Terminal"}
              />
            </div>
            {showDebtPanel && (
              <div className="p-4 flex rounded-[12px] mt-2.5 bg-[#fff5e6] shadow items-center justify-between">
                <span className="text-[#EC6724] text-[14px] font-medium">Qarz</span>
                <span className="text-[#EC6724] text-[16px] font-bold">
                  ${debtAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>
          <div className="w-full flex items-center rounded-[12px] justify-center flex-col bg-background shadow text-center p-[21px]">
            <p className="text-primary text-[13px]">Chegirma</p>
            <div className="flex text-2xl">
              <b>
                {(() => {
                  if (!total) return 0;
                  const debtPart = duty ? debtAmount : 0;
                  const revenue = sum.price + sum.plasticSum + debtPart;
                  return Math.max(((total - revenue) / total) * 100, 0).toFixed(2);
                })()}
              </b>
              <PercentIcons />
            </div>
          </div>
        </div>
        <div className="p-4 mt-2.5 rounded-[12px] bg-background shadow">
          <textarea
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCommit(e.target.value)
            }
            className="outline-none w-full no-spinner"
            placeholder={"Izoh"}
          />
        </div>
      </div>
      <div className="w-full bg-background flex justify-center px-2.5 py-[21px] shadow-[0_-4px_6px_rgba(0,0,0,0.1)] fixed bottom-0 left-0">
        <Button
          disabled={!canSubmit}
          onClick={
            isPending
              ? () => {}
              : () => {
                  if (transferToggle) {
                    handleSubmit({
                      isTransfer: true,
                      transferRemainder: Math.max(transferRemainder || 0, 0),
                      clientId: selectedClient?.id,
                      comment: commit,
                      price: 0,
                      plasticSum: 0,
                    });
                  } else {
                    const debtAmt = duty ? debtAmount : 0;
                    handleSubmit({
                      isDebt: debtAmt > 0,
                      clientId: selectedClient?.id,
                      debtAmount: debtAmt,
                      comment: commit,
                      ...sum,
                    });
                  }
                }
          }
          className="rounded-[12px] max-w-[500px] h-12 text-center w-full"
        >
          {isPending ? <Loader className="animate-spin" /> : ""}{" "}
          {transferToggle ? "O'tkazma orqali sotish" : "Sotish"}
        </Button>
      </div>
    </>
  );
}
