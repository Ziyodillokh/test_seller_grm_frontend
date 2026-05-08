import { getMonth, getYear } from "date-fns";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import BossCard from "@/components/cards/boss-card";
import { InfiniteLoader } from "@/components/InfiniteLoader";

import {   useKassaReport, useUserManagersAccountants } from "../../queries";

// const colms2 = (item: KassaData) => [
//   {
//     label: "Sotuv",
//     values: [
//       item?.sale
//     ],
//   },
//   {
//     label: "Kirim",
//     values: [
//         item?.income
//     ],
//   },
//   {
//     label: "Chiqim",
//     values: [
//         item?.expense
//     ],
//   },
//   {
//     label: "Inkassatsiya",
//     values: [
//         item?.cash_collection
//     ],
//   },
//   {
//     label: "Chegirma",
//     values: [
//         item?.discount
//     ],
//   },
//   {
//     label: "Foyda",
//     values: [
//         item?.additionalProfitTotalSum
//     ],
//   },
//   {
//     label: "Hajm",
//     values: [
//         item?.totalSize
//     ],
//   },
// ];
export default function BossKassaReport() {
  const [search] = useQueryState("search");
  const [month]=useQueryState("month",parseAsInteger.withDefault(getMonth(new Date()) +1))
  const [year]=useQueryState("year",parseAsInteger.withDefault(getYear(new Date())));
  const [, setSelect] = useQueryState(
    "select",
    parseAsString.withDefault("Products")
  );
  const [, setReportId] = useQueryState("reportId");
  const [, setReportName] = useQueryState("reportName");
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useKassaReport(
    {
      queries: {
        limit: 10,
        page: 1,
        search: search || undefined,
        month:month || undefined,
        year:year || undefined,
      },
    }
  );
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const {data:AvatarData} = useUserManagersAccountants({}) 

  return (
    <div className="flex flex-col gap-[8px] mt-[30px]">
      {flatData &&
        flatData?.map((item) => (
          <BossCard
            person={AvatarData?.items?.[0]?.avatar?.path}
            personName={AvatarData?.items?.[0]?.firstName}
            personStatus={(item?.status == "accepted"  || item?.status == "m_manager_confirmed")  ? "success" :"panding" }
            personSecondStatus={(item?.status == "accepted"  || item?.status == "accountant_confirmed" ) ? "success" :"panding" }
            personSecond={AvatarData?.items?.[1]?.avatar?.path}
            personSecondName={AvatarData?.items?.[1]?.firstName}
            status="Oy tugadi."
            key={item?.id}
            onClick={() => {
              setSelect("MonthlyReportsKassa");
              setReportId(item?.id)
              setReportName(item?.filial?.title)
            }}
            price={ `${((item?.totalSum) - item?.totalPlasticSum )?.toFixed(2)} $`}
            plaasticSum={ `${item?.totalPlasticSum?.toFixed(2) } $`}
            date={item?.createdAt}
            filial={item?.filial?.title}
            colums={
              []
            }
          />
        ))}
      <InfiniteLoader
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
