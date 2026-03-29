import {
  DefinedInitialDataOptions,
  useQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import {
  PlanYearData,
} from "./type";

interface IPlanYear {
  options?: DefinedInitialDataOptions<PlanYearData[]>;
  queries?: object;
}

const usePlanYear = ({ options, queries}: IPlanYear) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.planYear,queries],
    queryFn: () => getAllData<PlanYearData[], object>(apiRoutes.planYear,queries),
  });

export { usePlanYear }