import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { AddData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { DFormType } from "./schema";


const useOrderBasket = ({
  ...options
}: UseMutationOptions<[], Error, DFormType, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async (data) => {
      return await AddData<DFormType>(apiRoutes.orderBasket, data);
    },
  });

export default useOrderBasket;
