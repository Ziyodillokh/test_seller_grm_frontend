import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  // const QueryClient = useQueryClient()
  const { mutate,isPending } = useMutation({
    mutationFn: async (data: IOrderBasked) => {
      return await orderBaskedPost(apiRoutes.orderBasketItem, data);
    },
    onSuccess: () => {
      toast.success("Добавлен");
      setIsSelled(true);
      // QueryClient.invalidateQueries({ queryKey: [apiRoutes.orderBasketItem] });
    },
  });

  const handleSubmit = (data: IOrderBasked) => {
    mutate(data);
  };

  const navigate = useNavigate();
  return (
    <>
      <header className="flex  new t-10 z-10 mt-[19px]  items-center sticky top-0 left-0 w-full px-4 gap-2 py-[27px] bg-white shadow-md">
      <div onClick={()=>navigate('/basket')} className="flex items-center gap-2 cursor-pointer">
        <ChevronLeft />
        <p className="text-[22px] font-medium">To'lov sahifasi</p>
      </div>
    </header>
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
