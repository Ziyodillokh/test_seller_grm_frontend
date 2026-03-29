// import CarpetCard from "@/components/cards/carpet-card";
import {  useQueryState } from "nuqs";
import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import CarpetCard from "@/components/cards/carpet-card";
import SearchInput from "@/components/search-input";
import { FilialData } from "@/pages/hame/queries.ts";
import { useMeStore } from "@/store/me-store";

// import { useMeStore } from "@/store/me-store";
import FilterTabs from "../hame/ui/filter-tabs";
import { ProductsData } from "./type";
import BronModal from "./ui/bron-modal";
import HomeMenu from "./ui/home-menu";
import HomeMenuOthere from "./ui/home-menu-other";
export interface IContentProps {
  data: ProductsData[];
  isBacket?: boolean;
  tabList?: FilialData[];
  refetch?: () => void;
}

export default function Content(props: IContentProps) {
  const { data, isBacket, tabList } = props;
  const [search] = useQueryState("search");
  const location = useLocation()
  const isTransfer = location?.pathname  == "/home/transfer" ;
  const [, setTab] = useQueryState("tab");
  const [id] = useQueryState("id");
  const [, setSearchParams] = useSearchParams();
  const { meUser } = useMeStore();

  const handleTabFile = (item: { value: string; label: string }) => {
    const { value } = item;
    setTab(value);
    // refetch!()
  };

  useEffect(() => {
    if (!search) setSearchParams({});
  }, [search]);

  return (
    <>
      {meUser?.position.role == 2 ? <HomeMenu /> : <HomeMenuOthere />}

      <SearchInput className="p-6 mx-4 pl-5 mt-[23px]" />

      {search || id ? (
        <FilterTabs
          data={tabList?.map((el: FilialData) => ({
            value: el.id!,
            label: el?.title,
          }))}
          handleTabFile={handleTabFile}
          className="ml-2.5 mt-2.5"
        />
      ) : (
        ""
      )}
      <BronModal />
      <div className=" mt-[22px] mx-4  gap-2 grid row-start grid-cols-2  pb-[17px]">
        {data &&
          data?.map((item) => (
            <CarpetCard
            key={item?.id}
              id={item?.id}
              carpetType={item?.bar_code?.isMetric ? "Метражный" : "Штучный"}
              discount={""}
              img={item?.bar_code?.imgUrl?.path || undefined}
              // img="/images/image.png"
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
              isBron={Boolean(
                item?.booking_count === item?.book_count && item?.booking_count
              )}
              book_count={item?.book_count}
              // isTransfer={meUser?.position.role == 2 ? false:true}
              isTransfer={meUser?.position.role == 2 ? isTransfer : true}
              colaction={item?.bar_code?.collection?.title}
              color={item?.bar_code?.color?.title}
              isBacket={isBacket}
            />
          ))}
      </div>
    </>
  );
}
