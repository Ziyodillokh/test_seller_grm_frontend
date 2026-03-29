
import { DefinedInitialDataInfiniteOptions,useInfiniteQuery } from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { TData, TQuery } from "../types";

interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<TData>>;
  queries?: TQuery;
}

const usePartiyaFetch = ({ options, queries }: ITransfers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.partiya, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<TData>, TQuery>(apiRoutes.partiya ,
         { ...queries, page: pageParam as number, limit: 10 }
        ),
        getNextPageParam: (lastPage) => {
          if (lastPage.meta.currentPage <= lastPage.meta.totalPages) {
            return lastPage?.meta?.currentPage + 1;
          } else {
            return null;
          }
        },
    initialPageParam: 1 
  });

export default usePartiyaFetch;
