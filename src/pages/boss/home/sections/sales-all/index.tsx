import {  format, getMonth, getYear } from "date-fns";
import { Minus, Plus } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import BossCard from "@/components/cards/boss-card";
import FilterComboboxDemoInput from "@/components/filter/filterCombobox";
import { InfiniteLoader } from "@/components/InfiniteLoader";

import {  useCashFlowsTotal } from "../../queries";
import { CashFlowsFilteredData } from "../../type";


const colms2 = (item: CashFlowsFilteredData) => [
  {
    label:  "",
    values: item?.comment? [item?.comment  ]: ["No comment"],
  },

];
export default function BossTotalSales() {
  const [kassaId] = useQueryState("kassaId");
  const [kassaReportId] = useQueryState("kassaReportId");
  const [type] = useQueryState("type");

  const [month] = useQueryState(
    "month",
    parseAsInteger.withDefault(getMonth(new Date()) + 1)
  );
  const [year] = useQueryState(
    "year",
    parseAsInteger.withDefault(getYear(new Date()))
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCashFlowsTotal(
    {
      queries: {
        limit: 10,
        page: 1,
        filter: type||undefined,
        month: kassaReportId || kassaId ? undefined : month || undefined,
        year: kassaReportId || kassaId ? undefined : +year || undefined,
      },
    }
  );

  const flatData = data?.pages?.flatMap((page) => page?.cashflows || []) || [];

  return (
  <>
          <div className=" flex w-full gap-2 px-2.5">
          <FilterComboboxDemoInput
            isFilter={false}
            className="w-full pl-1 h-[39px] mb-[22px] bg-white rounded-[7px] border border-border"
            placeholder="Все"
            name="type"
            option={[
              {
                label: "Boss",
                value: "boss",
              },
              {
                label: "Biznes",
                value: "biznes",
              },
            ]}
          />
            <div className="flex items-center text-[16px] text-[#89A143] p-4 w-full  h-[36px] mb-[22px] bg-white rounded-[8px] border border-white">
              {data?.pages[0]?.summary.toFixed(2)}
            </div>
          </div>
          {flatData &&
        flatData?.map((item) => (
          <BossCard
          person={item?.avatar?.path}
          personStatus="success"
          // personName={item?.casher?.firstName}
          status={item?.title}
          statusColor={  item?.type == "Приход"?`bg-[#89A143]`:"bg-[#E38157]"}
            key={item?.id}
            iconComponent={
              item?.type == "Приход"
                ? () => (
                    <Plus
                      className={`p-3 w-12 h-12 text-white bg-[#89A143] rounded-[12px]`}
                    />
                  )
                : () => (
                    <Minus
                      className={`p-3 w-12 h-12 text-white bg-[#E38157]  rounded-[12px]`}
                    />
                  )
            }
            price={item?.type == "Приход"? item?.price + " $"  :undefined }
            priceSecond={item?.type == "Приход"? undefined:item?.price + "$"}
            date={format(new Date(item?.date), "dd MMMM yyyy")}
            colums={colms2(item as unknown as CashFlowsFilteredData) }
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
