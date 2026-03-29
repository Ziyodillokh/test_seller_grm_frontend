import { DefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

import {  getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { ProductsData } from "./type";

interface IProduct {
  options?: DefinedInitialDataOptions<ProductsData>;
  id: string;
  isPartiya?:boolean
}
const useProductId = ({ options, isPartiya, id }: IProduct) =>
  useQuery({
    ...options,
    queryKey: [isPartiya ? apiRoutes.excelProduct : apiRoutes.product, id],
    queryFn: () =>
      getByIdData<ProductsData, object>(
        isPartiya ? apiRoutes.excelProduct : apiRoutes.product,id
      ),
  });

export default useProductId;