import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import useBasketData from "@/pages/basket/list/queries.ts";
import { ProductsData } from "@/pages/hame/type.ts";
import { IOrderBasked, orderBaskedPost } from "@/service/apiHelpers.ts";
import { apiRoutes } from "@/service/apiRoutes.ts";

import Content from "./content";
import CheckView from "./view";

export default function CheckPage() {
  const [isSelled, setIsSelled] = useState(false);
  const { data } = useBasketData({
    queries:{
      is_transfer:false
    }
  });
  const { mutate,isPending } = useMutation({
    mutationFn: async (data: IOrderBasked) => {
      return await orderBaskedPost(apiRoutes.orderBasketItem, data);
    },
    onSuccess: () => {
      toast.success("Qo'shildi");
      setIsSelled(true);
    },
  });

  const handleSubmit = (data: IOrderBasked) => {
    mutate(data);
  };

  return (
    <>
      {isSelled ? (
        <CheckView />
      ) : (
        data?.items && (
          <Content
            data={data.items as unknown as ProductsData[]}
            handleSubmit={handleSubmit}
            isPending={isPending}
          />
        )
      )}
    </>
  );
}
