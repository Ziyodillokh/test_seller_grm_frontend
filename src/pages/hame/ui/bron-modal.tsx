import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw, ShoppingBasket } from "lucide-react";
import { useQueryState } from "nuqs";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { BronModalType } from "../type";

export default function BronModal() {
  const [openBronId, setOpenBronId] = useQueryState("openBronId");

  const { data } = useQuery({
    queryKey: [apiRoutes.orderBasketBookings, openBronId],
    queryFn: () =>
      getAllData<TResponse<BronModalType>, unknown>(apiRoutes.orderBasketBookings, {
        product: openBronId,
      }),
    enabled: Boolean(openBronId),
  });


  return (
    <Dialog onOpenChange={() => setOpenBronId(null)} open={Boolean(openBronId)}>
      <DialogContent className="max-w-[300px] z-1000">
        <DialogHeader className="max-w-[208px] mx-auto">
          <DialogTitle className="text-center text-[19px] font-bold ">
            Этот ковёр <br /> уже забронирован!
          </DialogTitle>
        </DialogHeader>
        <div className="w-full ">
          {data?.items?.map((item) => (
            <div
              key={item?.id}
              className=" flex items-center mb-1 pl-3 justify-between  p-2 w-full rounded-lg bg-white "
            >
              <div>
                <p className="text-[18px] text-primary">
                  {item?.seller?.firstName}
                </p>
                <p className="text-[14px] text-primary">
                  {item?.is_transfer ? "Трансфер" : "Карзинка"}
                </p>
              </div>
              <div
                className={` hover:bg-accent-foregroundcursor-pointer rounded-[10px] w-[50px] h-[50px] flex justify-center border relative  border-border items-center `}
              >
                {item?.is_transfer ? (
                  <RefreshCcw
                    color="#55554C"
                    className={`text-primary  w-[24px]`}
                  />
                ) : (
                  <ShoppingBasket className={`text-primary  w-[24px]`} />
                )}
                <p className="bg-[#FF7700] text-[11px] absolute top-[5px] right-[7px] px-1 text-white">
                  {item?.x}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
