import { useQueryState } from "nuqs";

import CarpetCard from "@/components/cards/carpet-card";
import { InfiniteLoader } from "@/components/InfiniteLoader";
import SearchInput from "@/components/search-input";
import {  FilialData, useProduct, useUserFiles } from "@/pages/hame/queries";

import QrTabs from "../../ui/qr-tabs";
import FilterTabs from "./filter-tabs";

export default function BossProducts() {
  const [search] = useQueryState("search");
  const [tab, setTab] = useQueryState("tab");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useProduct({
    queries: {
      limit: 10,
      page: 1,
      search: search || undefined,
      filialId:tab|| undefined
    },
  });

  const filels = useUserFiles({
    queries: {
      limit: 1000,
      page: 1,
      search: search  || undefined,
    },
  });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const handleTabFile = (item: { value: string; label: string }) => {
    const { value } = item;
    setTab(value);
    // refetch!()
  };
  return (
    <>
      <div className="px-2.5 pt-[17px] mb-4 rounded-2xl overflow-hidden">
        <QrTabs link={"boss/home"} />
        <SearchInput className="bg-white borer-0 rounded-b-2xl p-6 pl-5" />
      </div>

          {search  ? (
        <FilterTabs
          data={(filels?.data as unknown as FilialData[] )?.map((el: FilialData) => ({
            value: el.id!,
            label: el?.title,
          }))}
          handleTabFile={handleTabFile}
          className="ml-2.5 "
        />
      ) : (
        ""
      )}

      <div className="px-2.5 mt-4  gap-2 grid row-start grid-cols-2  pb-[17px]">
      {flatData && flatData?.map((item)=>(
        
        <CarpetCard
          id={item?.id}
          key={item?.id}
          className="bg-white border-border/40 rounded-2xl overflow-hidden"
          isBron={false}
          isBacket={true}
          img={item?.bar_code?.imgUrl?.path || undefined}
          carpetType={item?.bar_code?.isMetric ? "Метражный" : "Штучный"}
          discount={""}
          model={item?.bar_code?.model?.title}
          size={item?.bar_code?.size?.title}
          count={
            item?.bar_code?.isMetric
              ? Number((item?.y * 100).toFixed())
              : item?.count
          }
          shape={item?.bar_code?.shape?.title}
          price={
            item?.bar_code?.collection?.collection_prices?.[0]
              ?.priceMeter || 0
          }
          colaction={item?.bar_code?.collection?.title}
          color={item?.bar_code?.color?.title}
        />
      ))
        }

        <InfiniteLoader
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
