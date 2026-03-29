import {  parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import CarpetCard from "@/components/cards/carpet-card";
import SearchInput from "@/components/search-input";
import { FilialData } from "@/pages/hame/queries.ts";

import { TOneData } from "../types";

export interface IContentProps {
  data: TOneData[];
  isBacket?: boolean;
  tabList?: FilialData[];
  refetch?: () => void;
}
export default function Content(props: IContentProps) {
  const { data, isBacket } = props;
  const [search] = useQueryState("search");
  const [type] = useQueryState("tab",parseAsString.withDefault("переучет"));
  const [, setSearchParams] = useSearchParams();



  useEffect(() => {
    if (!search) setSearchParams({});
  }, [search]);


  return (
    <>
      <div className="px-2.5 pt-[17px] mb-4">
        <SearchInput className="p-6 pl-5" />
      </div>

    
      <div className="px-2.5 mt-4  gap-2 grid row-start grid-cols-2  pb-[17px]">
        {data &&
          data?.map((item) => (
            <CarpetCard
              id={item?.id}
              carpetType={item?.bar_code?.isMetric ? "Метражный" : "Штучный"}
              discount={""}
              key={item?.id}
              img={ undefined}
              model={item?.bar_code?.model?.title}
              size={item?.bar_code?.size?.title}
              type={type || "all"}
              isPartiya={true}
              count={
               ( item?.bar_code?.isMetric && type != "переучет")
                  ? Number((item?.y * 100).toFixed()) 
                  : type === "переучет"
                    ? item?.check_count
                    : type === "дефицит"
                      ? item?.count - item?.check_count
                      : type === "излишки"
                        ? item?.check_count - item?.count
                        : item?.count
              }
              shape={item?.bar_code?.shape?.title}
             
              colaction={item?.bar_code?.collection?.title}
              color={item?.bar_code?.color?.title}
              isBacket={isBacket}
            />
          ))}
      </div>
    </>
  );
}
