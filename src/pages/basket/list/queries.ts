import { DefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { ProductsData, ProductsQuery } from "../type";

interface IProduct {
  options?: DefinedInitialDataOptions<TResponse<ProductsData>>;
  queries?: ProductsQuery;
}
const useBasketData = ({ options, queries }: IProduct) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.orderBasket, queries],
    queryFn: () =>
      getAllData<TResponse<ProductsData>, ProductsQuery>(
        apiRoutes.orderBasket,
        queries
      ),
  });

export default useBasketData;
