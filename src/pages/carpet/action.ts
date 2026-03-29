import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import {  UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { TFormType } from "./schema";


const useCountChange = ({
  ...options
}: UseMutationOptions<[], Error, { id:string,data:TFormType}, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({data,id}) => {
      return await UpdatePatchData<TFormType>(apiRoutes.product,id, data);
    },
  });

export default useCountChange;
