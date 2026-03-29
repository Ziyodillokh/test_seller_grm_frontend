import {
  DefinedInitialDataInfiniteOptions,
  DefinedInitialDataOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import {
  BranchPlan,
  CashFlowsData,
  CashFlowsFilteredData,
  CashFlowsQuery,
  CashFlowsTotalData,
  CashflowSummary,
  CollectionRemainingFactory,
  KassaData,
  KassaQuery,
  KassaReportData,
  ModelsReport,
  RemainingProductsCollection,
  RemainingProductsFilial,
  ReportData,
  SellerPlan,
  SellerInPlan,
  SizeReport,
  UserManagersAccountants,
} from "./type";

interface ICashFlow {
  options?: DefinedInitialDataInfiniteOptions<TResponse<CashFlowsData>>;
  queries?: CashFlowsQuery;
}
interface ICashFlowTotal {
  options?: DefinedInitialDataInfiniteOptions<CashFlowsTotalData>;
  queries?: CashFlowsQuery;
}
interface ICashFlowFiltered {
  options?: DefinedInitialDataInfiniteOptions<TResponse<CashFlowsFilteredData>>;
  queries?: CashFlowsQuery;
}

interface IKassa {
  options?: DefinedInitialDataInfiniteOptions<TResponse<KassaData>>;
  queries?: CashFlowsQuery;
}

interface IKassaReport {
  options?: DefinedInitialDataInfiniteOptions<TResponse<KassaReportData>>;
  queries?: CashFlowsQuery;
}
interface IReport {
  options?: DefinedInitialDataOptions<TResponse<ReportData>>;
  queries?: CashFlowsQuery;
}
interface IRemainingProductsCollection {
  options?: DefinedInitialDataOptions<RemainingProductsCollection>;
  queries?: CashFlowsQuery;
}
interface IRemainingProducts {
  options?: DefinedInitialDataOptions<RemainingProductsCollection>;
  queries?: CashFlowsQuery;
}

interface IProductRemainingProductsFilial {
  options?: DefinedInitialDataOptions<RemainingProductsFilial[]>;
  queries?: CashFlowsQuery;
}

interface ICollectionRemainingFactory {
  options?: DefinedInitialDataOptions<CollectionRemainingFactory>;
  queries?: CashFlowsQuery;
  enabled?: boolean;
}

interface ICollectionRemaining {
  options?: DefinedInitialDataInfiniteOptions<CollectionRemainingFactory>;
  enabled?: boolean;
  queries?: CashFlowsQuery;
}
interface IBranchPlan {
  options?: DefinedInitialDataInfiniteOptions<TResponse<BranchPlan>>;
  queries?: CashFlowsQuery;
  year?: number;
}
interface ISellerPlan {
  options?: DefinedInitialDataInfiniteOptions<TResponse<SellerPlan>>;
  queries?: CashFlowsQuery;
}

interface IUserManagersAccountants {
  options?: DefinedInitialDataOptions<TResponse<UserManagersAccountants>>;
  queries?: CashFlowsQuery;
}

interface ICashflowSummary {
  options?: DefinedInitialDataOptions<CashflowSummary>;
  queries?: CashFlowsQuery;
}


interface IModelsReport {
  options?: DefinedInitialDataInfiniteOptions<TResponse<ModelsReport>>;
  queries?: CashFlowsQuery;
}

interface ISizeReport {
  options?: DefinedInitialDataInfiniteOptions<TResponse<SizeReport>>;
  queries?: CashFlowsQuery;
}


const useCashFlows = ({ options, queries }: ICashFlow) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.cashFlows, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<CashFlowsData>, CashFlowsQuery>(
        apiRoutes.cashFlows,
        {
          ...queries,
          page: pageParam as number,
          limit: 10,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage <= lastPage.meta.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

const useCashFlowsTotal = ({ options, queries }: ICashFlowTotal) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.bossReportsExpenses, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<CashFlowsTotalData, CashFlowsQuery>(
        apiRoutes.bossReportsExpenses,
        {
          ...queries,
          page: pageParam as number,
          limit: 10,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.currentPage <= lastPage.pagination?.totalPages) {
        return lastPage?.pagination?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });
const useKassa = ({ options, queries }: IKassa) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.kassa, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<KassaData>, KassaQuery>(apiRoutes.kassa, {
        ...queries,
        page: pageParam as number,
        limit: 10,
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

const useReport = ({ options, queries }: IReport) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.reports, queries],
    queryFn: () =>
      getAllData<TResponse<ReportData>, object>(apiRoutes.reports, queries),
  });

const useKassaReport = ({ options, queries }: IKassaReport) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.kassaReports, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<KassaReportData>, KassaQuery>(
        apiRoutes.kassaReports,
        {
          ...queries,
          page: pageParam as number,
          limit: 10,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage <= lastPage.meta.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

const useRemainingProductsCollection = ({
  options,
  queries,
}: IRemainingProductsCollection) =>
  useQuery({
    ...options,
    // /country-report
    queryKey: [queries?.typeOther == "none" ? apiRoutes.countryReport : apiRoutes.countryOrderReport, queries],
    queryFn: () =>
      getAllData<RemainingProductsCollection, object>(
        queries?.typeOther == "none" ? apiRoutes.countryReport : apiRoutes.countryOrderReport,
        queries
      ),
  });

const useRemainingProducts = ({ options, queries }: IRemainingProducts) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.remainingProducts, queries],
    queryFn: () =>
      getAllData<RemainingProductsCollection, object>(
        apiRoutes.remainingProducts,
        queries
      ),
  });

const useProductremainingProductsFilial = ({
  options,
  queries,
}: IProductRemainingProductsFilial) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.productremainingProductsFilial, queries],
    queryFn: () =>
      getAllData<RemainingProductsFilial[], object>(
        apiRoutes.productremainingProductsFilial,
        queries
      ),
  });

const useCollectionRemainingfactory = ({
  options,
  queries,
  enabled,
}: ICollectionRemainingFactory) =>
  useQuery({
    ...options,
    enabled,
    queryKey: [queries?.typeOther == "none" ? apiRoutes.factoryReport : apiRoutes.factoryOrderReport, queries],
    queryFn: () =>
      getAllData<CollectionRemainingFactory, object>(
        queries?.typeOther == "none" ? apiRoutes.factoryReport : apiRoutes.factoryOrderReport,
        queries
      ),
  });

const useCollectionRemaining = ({
  options,
  queries,
  enabled,
}: ICollectionRemaining) =>
  useInfiniteQuery({
    ...options,
    enabled,
    queryKey: [queries?.typeOther == "none" ? apiRoutes.collectionReport : apiRoutes.collectionOrderReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<CollectionRemainingFactory, CashFlowsQuery>(
        queries?.typeOther == "none" ? apiRoutes.collectionReport : apiRoutes.collectionOrderReport,
        {
          ...queries,
          page: pageParam as number,
          limit: 10,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (
        lastPage.meta.pagination?.page <= lastPage.meta?.pagination?.totalPages
      ) {
        return lastPage?.meta?.pagination?.page + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });
const useBranchPlan = ({ options, year, queries }: IBranchPlan) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.filialPlan, year, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<BranchPlan>, CashFlowsQuery>(
        apiRoutes.filialPlan + "/" + year,
        {
          ...queries,
          page: pageParam as number,
          limit: 10,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage <= lastPage.meta.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

const usePlanYearSellers = ({ options, queries }: ISellerPlan) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.planYearSellers, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<SellerPlan>, CashFlowsQuery>(
        apiRoutes.planYearSellers,
        {
          ...queries,
          page: pageParam as number,
          limit: 10,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage <= lastPage.meta.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

const useUserManagersAccountants = ({
  options,
  queries,
}: IUserManagersAccountants) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.userManagersAccountants, queries],
    queryFn: () =>
      getAllData<TResponse<UserManagersAccountants>, object>(
        apiRoutes.userManagersAccountants,
        queries
      ),
  });

const useCashflowSummary = ({ options, queries }: ICashflowSummary) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.cashflowSummary, queries],
    queryFn: () =>
      getAllData<CashflowSummary, object>(apiRoutes.cashflowSummary, queries),
  });

const useCashFlowsFiltered = ({ options, queries }: ICashFlowFiltered) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.cashflowFiltered, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<CashFlowsFilteredData>, CashFlowsQuery>(
        apiRoutes.cashflowFiltered,
        {
          ...queries,
          page: pageParam as number,
          limit: 10,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage <= lastPage.meta.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

const useModelsReport = ({ options, queries }: IModelsReport) =>
  useInfiniteQuery({
    ...options,
    queryKey: [queries?.typeOther == "none" ? apiRoutes.modelsReport : apiRoutes.modelsOrderReport, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<ModelsReport>, CashFlowsQuery>(
        queries?.typeOther == "none" ? apiRoutes.modelsReport : apiRoutes.modelsOrderReport,
        {
          ...queries,
          page: pageParam as number,
          limit: 10,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage <= lastPage?.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

const useSizeReport = ({ options, queries }: ISizeReport) =>
  useInfiniteQuery({
    ...options,
    queryKey: [queries?.typeOther == "none" ? apiRoutes.sizeReport : apiRoutes.sizeOrderReport, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<SizeReport>, CashFlowsQuery>(
        queries?.typeOther == "none" ? apiRoutes.sizeReport : apiRoutes.sizeOrderReport,
        {
          ...queries,
          page: pageParam as number,
          limit: 10,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage <= lastPage?.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });
// /size/reports
export {
  useBranchPlan,
  useCashFlows,
  useCashFlowsFiltered,
  useCashFlowsTotal,
  useCashflowSummary,
  useCollectionRemaining,
  useCollectionRemainingfactory,
  useKassa,
  useKassaReport,
  useModelsReport,
  usePlanYearSellers,
  useProductremainingProductsFilial,
  useRemainingProducts,
  useRemainingProductsCollection,
  useReport,
  useSizeReport,
  useUserManagersAccountants,
  usePlanSellersFetch,
};

interface IPlanSellers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<SellerInPlan>>;
  queries?: CashFlowsQuery;
  year?: string | number | null;
  filialId: string | null;
}

const usePlanSellersFetch = ({ options, queries, year, filialId }: IPlanSellers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.filialPlan, "by-filial", queries, year, filialId],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<SellerInPlan>, CashFlowsQuery>(
        `${apiRoutes.filialPlan}/by-filial/${filialId}`,
        {
          ...queries,
          year: Number(year),
          page: pageParam as number,
          limit: queries?.limit || 10,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage < lastPage?.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
    enabled: !!filialId,
  });
