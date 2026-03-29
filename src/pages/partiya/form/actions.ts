import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdateData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import {  TOneData, TQuery } from "../types";

interface IData {
  options?: DefinedInitialDataOptions<TOneData>;
  id: string | undefined;
  queries?: TQuery;
}

interface IMuteCheck {
  data: {
    code:string,
    y:number,
    tip:string| undefined,
  }
  isUpdate:boolean,
  partiyaId:string
}

export const useProdcutCheck = ({
  ...options
}: UseMutationOptions<object, Error, IMuteCheck, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ partiyaId, data, isUpdate }) => {
      if(isUpdate){
        return await UpdateData(apiRoutes.excelProduct, partiyaId, data);
      }else{
        return await AddData(apiRoutes.excelProduct + "/" + partiyaId, data);
      }
    },
  });

export const useProductId = ({ options, id, queries }: IData) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.qrBase, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TOneData, TQuery>(apiRoutes.qrBase, id || "", queries),
  });

  export const useBarCodeById = ({ options, id, queries }: IData) =>
    useQuery({
      ...options,
      queryKey: [apiRoutes.qrBase + 'find-by', id],
      enabled: Boolean(id),
      queryFn: () =>
        getByIdData<TOneData, TQuery>(apiRoutes.qrBase+ '/find-by', id || "", queries),
    });
  
  
