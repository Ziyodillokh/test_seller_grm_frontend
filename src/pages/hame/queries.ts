import {
  DefinedInitialDataInfiniteOptions,
  DefinedInitialDataOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { FilelsQuery, ProductsData, ProductsQuery } from "./type";

// interface IProduct {
//   options?: DefinedInitialDataOptions<TResponse<ProductsData>>;
//   queries?: ProductsQuery;
// }

export interface FilialData {
  id: string;
  name: string;
  title: string;
  type: string;
  address: string;
  addressLink: string;
  landmark: string;
  phone1: string;
  phone2: string;
  telegram: string;
  startWorkTime: string;
  endWorkTime: string;
  managerId: string;
  isActive: boolean;
  hickCompleted: boolean;
  need_get_report: boolean;
}
interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<ProductsData>>;
  queries?: ProductsQuery;
}
const useProduct = ({ options, queries }: ITransfers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.product, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<ProductsData>, ProductsQuery>(apiRoutes.product, {
        ...queries,
        page: pageParam as number,
        limit:10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage <= lastPage.meta.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

const useUserFiles = ({
  options,
  queries,
}: {
  options?: DefinedInitialDataOptions<TResponse<ProductsData>>;
  queries?: FilelsQuery;
}) => {
  return useQuery({
    ...options,
    enabled: Boolean(queries?.search),
    queryKey: [apiRoutes.file, queries],
    queryFn: () =>
      getAllData<TResponse<ProductsData>, FilelsQuery>(apiRoutes.file, {
        limit: queries?.limit || 10, page: queries?.page || 1,
        ...queries
      }),
  });
};

export { useProduct, useUserFiles };
