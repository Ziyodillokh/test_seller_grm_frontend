import { format, getMonth, getYear } from "date-fns";
import {  Minus, Plus } from "lucide-react";
import {  parseAsInteger, useQueryState } from "nuqs";

import BossCard from "@/components/cards/boss-card";
import { InfiniteLoader } from "@/components/InfiniteLoader";

import {  useCashFlowsFiltered } from "../../queries";
import {  CashFlowsFilteredData } from "../../type";

const colms2 = (item: CashFlowsFilteredData) => [
  // {
  //   label: item?.type,
  //   values: [
  //     item?.price + "$",
  //   ],
  // },
  {
    label:  "",
    values: item?.comment? [item?.comment  ]: ["No comment"],
  },

];
export default function InComePage() {
  const [month]=useQueryState("month",parseAsInteger.withDefault(getMonth(new Date()) +1))
  const [year]=useQueryState("year",parseAsInteger.withDefault(getYear(new Date())));
  const [select] = useQueryState("select");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCashFlowsFiltered(
    {
      queries: {
        limit: 10,
        page: 1,
        // search: search || undefined,
        type:select =="inCome" ? "Приход" : "Расход",
        month: month  || undefined,
        year: +year || undefined,
      },
    }
  );

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      {flatData &&
        flatData?.map((item) => (
          <BossCard
          person={item?.casher?.avatar?.path}
          personStatus="success"
          personName={item?.casher?.firstName}
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
            colums={colms2(item) }
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
