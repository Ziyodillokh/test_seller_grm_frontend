import { format, getMonth, getYear } from "date-fns";
import { ChevronLeft, Minus, Plus, Store } from "lucide-react";
import {  parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";

import BossCard from "@/components/cards/boss-card";
import { DateRangePicker } from "@/components/filter/date-picker-range";
import FilterComboboxDemoInput from "@/components/filter/filterCombobox";
import { InfiniteLoader } from "@/components/InfiniteLoader";

import { useCashFlows, useCashflowSummary } from "../../queries";
import { CashFlowsData } from "../../type";
interface IColums {
  label: string;
  values: string[] | number[];
}
// const colmsArr = [
//   {
//     label: "Продажа",
//     values: ["51505.80"],
//   },
//   {
//     label: "Приход",
//     values: ["51505.80"],
//   },
//   {
//     label: "Расход",
//     values: ["51505.80"],
//   },
//   {
//     label: "Инкассация",
//     values: ["51505.80"],
//   },
//   {
//     label: "Скидка",
//     values: ["51505.80"],
//   },
//   {
//     label: "Навар",
//     values: ["51505.80"],
//   },
//   {
//     label: "Объём",
//     values: ["51505.80"],
//   },
// ];
const colms2 = (item: CashFlowsData) => [
  {
    label: item?.order?.bar_code?.collection?.title,
    values: [
      item?.order?.bar_code?.model?.title,
      item?.order?.bar_code?.size?.title,
      item?.order?.price + "$",
      item?.order?.x + (item?.order?.bar_code?.isMetric ? "" : "x"),
    ],
  },
  {
    label: item?.order?.bar_code?.isMetric ? "Метражный" : "Штучный",
    values: [
      item?.order?.bar_code?.shape?.title,
      item?.order?.bar_code?.style?.title,
      item?.order?.bar_code?.color?.title,
      item?.order?.bar_code?.country?.title,
    ],
  },
  {
    label:  "",
    values: item?.comment || item?.order?.comment? [item?.comment || item?.order?.comment ]: ["No comment"],
  },
];
export default function BossSales() {
  const [search] = useQueryState("search");
  const [filial] = useQueryState("filial");
  const [user,setUser] = useQueryState("user");
  const [kassaId] = useQueryState("kassaId");
  const [kassaReportId] = useQueryState("kassaReportId");
  const [reportName] = useQueryState("reportName");
  
  const [month]=useQueryState("month",parseAsInteger.withDefault(getMonth(new Date()) +1))
  const [year]=useQueryState("year",parseAsInteger.withDefault(getYear(new Date())));
  const [,setSelect] = useQueryState("select");
  const [type] = useQueryState("type");
  
  const [fromDate] = useQueryState<Date>("startDate", {
    parse: (value) => value ? new Date(value) : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  });
  const [toDate] = useQueryState<Date>("endDate", {
    parse: (value) => value ? new Date(value) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCashFlows(
    {
      queries: {
        limit: 10,
        page: 1,
        search: search || undefined,
        tip: (kassaId ||kassaReportId )? (type == "salse" || type == "return")  ?  "order" : (type == "Приход" || type == "Расход") ? "cashflow" :undefined: "order",
        sellerId:user || undefined,
        filialId:filial || undefined,
        month: kassaReportId|| kassaId? undefined: month  || undefined,
        year: kassaReportId || kassaId? undefined:  +year || undefined,
        fromDate:fromDate || undefined,
        toDate:toDate|| undefined,
        kassaId: kassaId || undefined,
        kassaReport:kassaReportId || undefined,
        type: (kassaId ||kassaReportId )? type == "salse" ? "Приход": type == "return"? "Расход" : type || undefined : undefined
      },
    }
  );

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const {data:cashflowSummary}= useCashflowSummary({
    queries: {
      month: month  || undefined,
      year: +year || undefined,
      startDate:fromDate?.getDate() || 1,
      endDate: toDate?.getDate() || new Date(year, month, 0).getDate(),
      filialId:filial || undefined,
    },
  });

  
  useEffect(()=>{
    setUser(null);
  },[filial])


  return (
    <>
    {(kassaId || kassaReportId)? 
    <div className="flex gap-2 items-center px-3">
          <p onClick={()=>setSelect("MonthlyReportsKassa")} className="p-2 cursor-pointer  text-[#45453C] text-[14px] flex w-full items-center gap-[5px] rounded-[6px] bg-background border-border border mb-[24px]">
              <ChevronLeft size={20} />
          {reportName}
        </p>

   {kassaReportId? "": <FilterComboboxDemoInput
        isFilter={false}
        className="w-full pl-1 h-[39px] mb-[22px] bg-white rounded-[7px] border border-border"
        placeholder="Все" 
        name="type"
        option={[
          {
            label:"Приход",
            value:"Приход"
          },
          {
            label:"Расход",
            value:"Расход"
          },
          {
            label:"Продажа",
            value:"salse"
          },
          {
            label:"Возврат",
            value:"return"
          }
        ]}
      />}
    </div>:
     <>
     <DateRangePicker currentMonth={month-1} isonlyDay={true} btnClassName="bg-white hover:bg-white" className="w-full px-2.5 mb-2"/>
      <div className=" flex w-full gap-2 px-2.5">
     
    <FilterComboboxDemoInput
      isFilter={false}
        className="w-full  h-[36px] mb-[22px] bg-white rounded-[8px] border border-white"
        placeholder="Все филиалы" 
        fetchUrl="/filial/warehouse-and-filial"
         name="filial"
         icons={
          <>
            <Store  width={20} height={20}/>
          </>
        }
        fieldNames={{label:"title",value:"id"}}
      />
      <div className="flex items-center text-[16px] text-[#89A143] p-4 w-full  h-[36px] mb-[22px] bg-white rounded-[8px] border border-white">
          {cashflowSummary?.totalIncome?.toFixed(2)}
      </div>
      
      </div>
    </>}
      {flatData &&
        flatData?.map((item) => (
          <BossCard
            person={item?.order?.seller?.avatar?.path}
            personName={item?.order?.seller?.firstName}
            personSecond={item?.casher?.avatar?.path }
            personSecondName={ item?.casher?.firstName}
            personStatus={item?.order?.status == "accepted" ? "success": item?.order?.status == "rejected" ? "fail" :"panding" }
            personSecondStatus={item?.order?.status == "accepted" ? "success": item?.order?.status == "rejected" ? "fail" :"panding" }
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
            price={
             ( item?.price && item?.type == "Приход" )
                ? `+${item?.order ? (item?.price - item?.order?.plasticSum)?.toFixed(2): item?.price?.toFixed(2)}$`
                : undefined
            }
            plaasticSum={
              item?.order?.plasticSum
                ? `+${item?.order?.plasticSum?.toFixed(2)}$`
                : undefined
            }
            priceSecond={
              item?.order?.discountSum  ||item?.order?.discountSum == 0
                ? ` -${item?.order?.discountSum}$`
                :  item?.price
                ? `+${item?.order ? (item?.price - item?.order?.plasticSum)?.toFixed(2): item?.price?.toFixed(2)}$`
                : undefined
            }
            status={item?.order?.status}
            date={format(new Date(item?.date), "dd MMMM yyyy")}
            filial={kassaId? item?.type :  item?.filial?.name}
            colums={
              item?.order
                ? (colms2(item) as unknown as IColums[])
                : ([
                    {
                      label: "",
                      values: [item?.comment || item?.order?.comment],
                    },
                  ] as unknown as IColums[])
            }
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
