import {
  DefinedInitialDataOptions,
  useQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import {  TQuery, TSingleData } from "../type";

interface ITransfers {
  options?: DefinedInitialDataOptions<TSingleData>;
  queries?: TQuery;
}

const useClientsDebtData = ({ options, queries }: ITransfers) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.orderClientDebt, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TSingleData, TQuery>(apiRoutes.orderClientDebt, {
        ...queries,
        page: pageParam as number,
        limit: 20,
      }),
  });

export default useClientsDebtData;
