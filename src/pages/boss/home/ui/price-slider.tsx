
import { useQuery } from "@tanstack/react-query";
import { getMonth, getYear } from "date-fns";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";

import AnimatedNumber from "@/components/animated-number";
import { getAllData, getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { useReport } from "../queries";
import { TManagerTatalType, TManagerType } from "../type";
import CustomSwiper from "./swiper-month";

export default function PriceSlider() {
 
  const [,setMonth]=useQueryState("month",parseAsInteger)
  const [,setYear]=useQueryState("year",parseAsInteger)
  const [activeIndex]=useQueryState("activeIndex",parseAsInteger.withDefault(getMonth(new Date()) ))
  const {data}= useReport({});
  const [select,setSelect] = useQueryState(
    "select",
    parseAsString.withDefault("Products")
  );
  const currentmonthData = data?.items?.find((item) => item.month === (activeIndex+1 ));

  useEffect(()=>{
    setMonth(currentmonthData?.month || getMonth(new Date()) + 1)
    setYear(currentmonthData?.year || getYear(new Date()))
  },[currentmonthData])

  const {data:cashflowFoMainManager} = useQuery({
    queryKey:[apiRoutes.cashflowFoMainManager,currentmonthData?.id],
    queryFn:()=>getByIdData<TManagerType,object>(apiRoutes.cashflowFoMainManager,currentmonthData?.id ||" "),
    enabled:currentmonthData?.id !== undefined
  })

  const {data:TotalSumData} = useQuery({
    queryKey:[apiRoutes.bossReportsNetProfitSum,currentmonthData?.id],
    queryFn:()=>getAllData<TManagerTatalType,object>(apiRoutes.bossReportsNetProfitSum,{
      month:currentmonthData?.month,
      year:currentmonthData?.year
    }),
    enabled:currentmonthData?.id !== undefined
  })

  
  return (
    <div className="w-[calc(100%-52px)] sm:w-[360px]  z-90 relative  rounded-[20px] overflow-hidden bg-white mb-2.5  mx-[26px] sm:mx-auto">
    
        <CustomSwiper data={data?.items || []} />

        <div className="flex justify-center w-full   z-100">
         <p   onClick={()=>setSelect("BossTotalsales")} className={` ${select == "BossTotalsales"? 'text-[#89A143]':''} text-center cursor-pointer static  z-100 font-semibold mb-[11px] text-[28px]`} ><AnimatedNumber value={TotalSumData?.totalNetProfit ||0} /></p>  
        </div>
        <div className="flex  z-100  border-t border-border/40">
            <p onClick={()=>setSelect("inCome")} className={`${select =="inCome" ? "text-white  bg-[#89A143]":"text-[#89A143] cursor-pointer " } z-100  text-center w-full p-4 text-[14px] border-r border-border/40 `}>
            <AnimatedNumber value={cashflowFoMainManager?.income ||0} />
            </p>
            <p onClick={()=>setSelect("outCome")}   className={`${select =="outCome" ? "text-white  bg-[#FF7700]":"text-[#FF7700] cursor-pointer " } text-center  z-100  w-full p-4 text-[14px] border-r border-border/40 `}>
               <AnimatedNumber value={cashflowFoMainManager?.expense || 0 }/>
            </p>
        </div>
    </div>
  )
}
