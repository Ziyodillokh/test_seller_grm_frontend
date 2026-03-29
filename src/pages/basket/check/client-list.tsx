import { Dispatch, SetStateAction } from "react";

import { InfiniteLoader } from "@/components/InfiniteLoader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useClientsData from "@/pages/client/list/queries";
import { TData } from "@/pages/client/type";
import { useMeStore } from "@/store/me-store";

export default function ClientList({
  open,
  setOpen,
  value,
  setValue,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  value: TData | undefined;
  setValue: Dispatch<SetStateAction<TData | undefined>>;
}) {
  const { meUser } = useMeStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useClientsData({
      queries: {
        filial: meUser?.filial?.id || undefined,
      },
    });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  return (
    <Dialog
      open={open}
      onOpenChange={(isopen: boolean) => {
        setOpen(isopen);
        setValue(undefined);
      }}
    >
      <DialogContent className="max-w-[450px] ">
        <p className="text-[18px] text-primary font-medium ">Клиенты</p>
        <div className="max-h-[400px] overflow-scroll">
          {flatData?.map((e) => (
            <div
              onClick={() => setValue(e)}
              className={`${value?.id == e?.id ? "bg-card border-border" : " border-border"} rounded-[12px] border w-full mb-1 hover:bg-[#F1F0E9]  py-2.5  px-[15px]`}
            >
              <p className="text-primary text-[14px] font-medium">
                {e?.fullName}
              </p>
              <p className="pt-[2px] text-[#58A0C6]  text-[14px] font-medium">
                {e?.phone}
              </p>
            </div>
          ))}
     
          <InfiniteLoader
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
        <Button
        onClick={() => setOpen(false)}
        className="rounded-[12px] mt-10 h-12 text-center w-full"
      >
       Вибрать
      </Button>
      </DialogContent>
    </Dialog>
  );
}
