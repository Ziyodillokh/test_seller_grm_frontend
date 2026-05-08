import { useQuery } from "@tanstack/react-query";
import { getMonth, getYear } from "date-fns";
import { ChevronLeft, Store } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import BossCard from "@/components/cards/boss-card";
import FilterComboboxDemoInput from "@/components/filter/filterCombobox";
import { InfiniteLoader } from "@/components/InfiniteLoader";
import { getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { useKassa } from "../../queries";
import { KassaData } from "../../type";

const colms2 = (item: KassaData) => [
  {
    label: "Sotuv",
    values: [item?.sale],
  },
  {
    label: "Terminal",
    values: [item?.plasticSum],
  },
  {
    label: "Kirim",
    values: [item?.income],
  },
  {
    label: "Chiqim",
    values: [item?.expense],
  },
  {
    label: "Inkassatsiya",
    values: [item?.cash_collection],
  },
  {
    label: "Chegirma",
    values: [item?.discount],
  },
  {
    label: "Foyda",
    values: [item?.additionalProfitTotalSum],
  },
  {
    label: "Hajm",
    values: [item?.totalSize],
  },
];

type KassaData2 = {
  income: 0;
  expense: 0;
};
export default function BossKassa() {
  const [search] = useQueryState("search");
  const [filial] = useQueryState("filial");
  const [month] = useQueryState(
    "month",
    parseAsInteger.withDefault(getMonth(new Date()) + 1)
  );
  const [year] = useQueryState(
    "year",
    parseAsInteger.withDefault(getYear(new Date()))
  );
  const [reportId] = useQueryState("reportId");
  const [, setKassaId] = useQueryState("kassaId");
  const [, setKassaReportId] = useQueryState("kassaReportId");
  const [, setType] = useQueryState("type");
  
  const [reportName] = useQueryState("reportName");
  const [, setSelect] = useQueryState(
    "select",
    parseAsString.withDefault("Products")
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useKassa({
    queries: {
      limit: 10,
      page: 1,
      search: search || undefined,
      filial: filial || undefined,
      month: reportId ? undefined : month || undefined,
      year: reportId ? undefined : year || undefined,
      report: reportId || undefined,
    },
  });

  const { data: cashflowForFilialManager } = useQuery({
    queryKey: [apiRoutes.cashflowForFilialManager],
    queryFn: () =>
      getByIdData<KassaData2, object>(
        apiRoutes.cashflowForFilialManager,
        reportId || ""
      ),
  });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      {reportName ? (
        <p
          onClick={() => setSelect("MonthlyReports")}
          className="p-2 cursor-pointer mx-3 text-[#45453C] text-[14px] flex w-1/2 items-center gap-[5px] rounded-[6px] bg-background border-border border mb-[24px]"
        >
          <ChevronLeft size={20} />
          {reportName}
        </p>
      ) : (
        <div className=" flex w-full gap-2 px-2.5">
          <FilterComboboxDemoInput
            isFilter={false}
            className="w-full  h-[36px] mb-[22px] bg-white rounded-[8px] border border-white"
            placeholder="Barcha filiallar"
            fetchUrl="/filial/warehouse-and-filial"
            name="filial"
            icons={
              <>
                <Store width={20} height={20} />
              </>
            }
            fieldNames={{ label: "title", value: "id" }}
          />
        </div>
      )}

      <div className="flex border-border border mb-[30px] mt-[6px] mx-3 w-[95%] rounded-lg">
        <div onClick={()=>{
             setSelect("MonthlyReportsKassaSingle");
             setKassaReportId(reportId);
             setType("Kirim");
             setKassaId(null)
        }} className="px-5 cursor-pointer py-3 w-1/2 flex items-center border-border border-r gap-2.5">
          <p className="text-[12px] text-[#62625F]">Kirim</p>
          <p className="text-[12px] text-[#89A143]">
            {cashflowForFilialManager?.income}
          </p>
        </div>
        <div onClick={()=>{
             setSelect("MonthlyReportsKassaSingle");
             setKassaReportId(reportId);
             setType("Chiqim");
             setKassaId(null)
        }} className="px-5 cursor-pointer py-3 w-1/2 flex items-center gap-2.5">
          <p className="text-[12px] text-[#62625F]">Chiqim</p>
          <p className="text-[12px] text-[#E38157]">
            {cashflowForFilialManager?.expense}
          </p>
        </div>
      </div>
      {flatData &&
        flatData?.map((item) => (
          <BossCard
            person={item?.closer?.avatar?.path}
            personName={item?.closer?.firstName}
            personSecond={item?.closer_m?.avatar?.path}
            personSecondName={item?.closer_m?.firstName}
            personStatus={
              item?.status == "accepted"
                ? "success"
                : item.status == "fail"
                  ? "fail "
                  : "panding"
            }
            personSecondStatus={
              item?.status == "accepted"
                ? "success"
                : item.status == "fail"
                  ? "fail"
                  : "panding"
            }
            key={item?.id}
            price={
              item?.totalSum
                ? `${(item?.totalSum - (item?.plasticSum || 0)).toFixed(2)} $`
                : "0 $"
            }
            plaasticSum={`${item?.plasticSum?.toFixed(2)} $`}
            onClick={
              reportId
                ? () => {
                    setSelect("MonthlyReportsKassaSingle");
                    setKassaId(item?.id);
                    setKassaReportId(null)
                    setType(null)
                  }
                : undefined
            }
            status={item?.status}
            // date={}
            filial={reportId ? undefined : item?.filial?.title}
            colums={colms2(item)}
          />
        ))}
      <InfiniteLoader
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
}
