import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Banknote, Loader, Minus, Plus } from "lucide-react";
import { useState } from "react";
import {  useParams } from "react-router-dom";
import { toast } from "sonner";

import CheckList from "@/components/check";
import { Button } from "@/components/ui/button";
import {  UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

import useClientsDebtData from "./queries";
// /order/orders/client-debt

type TData = {
  amount: number |undefined;
};

export default function SingleCliennt() {
  const { meUser } = useMeStore();
  const [dataResult, setDataResult] = useState<TData>({ amount: undefined });
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data } = useClientsDebtData({
    queries: {
      clientId: id,
    },
  });
  const { mutate,isPending } = useMutation({
    mutationFn: async () => {
      return await UpdatePatchData(`client/${id}`, "pay", dataResult);
    },
    onSuccess: () => {
        toast.success("updatedSuccessfully");
        queryClient.invalidateQueries({ queryKey: [apiRoutes.orderClientDebt] });
        setDataResult({ amount: undefined });
    },
  });

  // const { mutate: completeDebt,isPending:isPendingCompleteDebt} = useMutation({
  //   mutationFn: async () => {
  //     return await AddData(`client/${id}/complete-debt`, {});
  //   },
  //   onSuccess: () => {
  //       toast.success("updatedSuccessfully");
  //       navigate(apiRoutes?.clients)
  //   },
  // });

  return (
    <div>
      <CheckList
      isclient
        username={meUser?.firstName + " " + meUser?.lastName}
        title={meUser?.filial?.title ?? ""}
        address={meUser?.filial?.address ?? ""}
        data={data?.orders?.items || []}
      />

      <div className="flex gap-2 mt-5 items-center ">
        <div className="w-2/3">
          <p className="text-[13px] text-primary mb-2">Продать в долг</p>
          <div className="p-4 flex rounded-[12px] mb-0.5 bg-card items-center gap-1">
            <Banknote color="#55554C" size={"18px"} />
            {/*<p className="text-primary/40">Наличие</p>*/}
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value === "" ? undefined : Number(e.target.value);
                setDataResult({ ...dataResult, amount: value });
              }}
              type={"number"}
              max={data?.client?.owed}
              value={dataResult.amount ?? ""}
              className="outline-none w-full no-spinner"
              placeholder={"Наличие"}
            />
          </div>
        </div>

        <div className="w-1/3">
          <p className="text-[13px] text-primary mb-2">Долг</p>
          <div className="p-4 flex rounded-[12px] mb-0.5 bg-card items-center gap-1">
            <Minus color="#55554C" size={"18px"} />
            <p className="text-[18px] font-bold text-primary/40">
              {data?.client?.owed}
            </p>
          </div>
        </div>
        <div className="w-1/3">
          <p className="text-[13px] text-primary mb-2">Дано</p>
          <div className="p-4 flex rounded-[12px] mb-0.5 bg-card items-center gap-1">
            <Plus color="#55554C" size={"18px"} />
            <p className="text-[18px] font-bold text-primary/40">
              {data?.client?.given}
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={() => {
          if((data?.client?.owed || 0) <= (dataResult.amount || 0)){
            toast.error(`To'lov miqdori qarz miqdoridan ortiq. Qarz: ${data?.client?.owed}, To'lov: ${dataResult.amount}`)
          }else{
            mutate()
          }
        }}
        disabled={isPending || dataResult.amount == 0}
        className="  mt-10 h-[56px] text-center w-full"
      >
        {
            isPending ? <Loader className="animate-spin"/>:""
        }
        Оплатить 
      </Button>
      {/* <Button
         disabled={(data?.client?.owed || 0 ) > 0 ||isPendingCompleteDebt }
        onClick={() => completeDebt()}
        className=" mt-2 h-[56px] text-center w-full"
      >
         {
            isPendingCompleteDebt ? <Loader className="animate-spin"/>:""
        }
        Оформить продажу
      </Button> */}
    </div>
  );
}
