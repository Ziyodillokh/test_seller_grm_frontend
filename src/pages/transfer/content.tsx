

// import CarpetCard from "@/components/cards/carpet-card";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import CarpetCard from "@/components/cards/carpet-card";
import SearchInput from "@/components/search-input";

import { ProductsData } from "../hame/type";
import BronModal from "../hame/ui/bron-modal";
import QrTabs from "../hame/ui/qr-tabs";
export interface IContentProps {
  data: ProductsData[];
  isBacket?: boolean;
  refetch?: () => void;
}
export default function TransferContent(props: IContentProps) {
  const { data, isBacket } = props;
  const [search] = useQueryState("search");
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!search) setSearchParams({});
  }, [search]);

  return (
    <>
      <div className="px-2.5 pt-[17px] mt-4 mb-4">
      <QrTabs  qrCodeText="Отсканируйте штрих-код или QR-код." showBarcode="" type="transfer" link={"transfer"} />
        <SearchInput className="p-6 pl-5" />
      </div>

      <BronModal />
      <div className="px-2.5 mt-4  gap-2 grid row-start grid-cols-2  pb-[17px]">
        {data &&
          data?.map((item) => (
            <CarpetCard
               key={item?.id}
              id={item?.id}
              carpetType={item?.bar_code?.isMetric ? "Metrli" : "Donabay"}
              discount={""}
              img={item?.bar_code?.imgUrl?.path || undefined}
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
                item?.booking_count && item?.booking_count >= item?.count
              )}
              book_count={item?.booking_count}
              colaction={item?.bar_code?.collection?.title}
              color={item?.bar_code?.color?.title}
              isTransfer={true}
              isBacket={isBacket}
            />
          ))}
      </div>
    </>
  );
}
