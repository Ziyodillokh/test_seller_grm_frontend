import CarpetCard from "@/components/cards/carpet-card";

import { ProductsData } from "./type";
import BronsModals from "./ui/madal";

export default function Content({ data }: { data: ProductsData[] }) {
  return (
    <>
      <BronsModals />
      <div>
        <p className="text-center py-2 text-primary">Продуктов нет</p>
      </div>
      <div className="px-2.5  mt-4 gap-2 grid row-start grid-cols-2  pb-[17px]">
        {data.map((item) => (
          <CarpetCard
            id={item?.id}
            carpetType={
              item?.product?.bar_code?.isMetric ? "Метражный" : "Штучный"
            }
            discount={""}
            img={item?.product?.bar_code?.imgUrl?.path || undefined}
            model={item?.product?.bar_code?.model?.title}
            size={item?.product?.bar_code?.size.title}
            count={
              item?.product?.bar_code?.isMetric ? item?.y * 100 : item?.count
            }
            shape={item?.product?.bar_code?.shape.title}
            price={item?.priceMeter}
            colaction={item?.product?.bar_code?.collection?.title}
            color={item?.product?.bar_code?.color?.title}
            // isBacket={isBacket}
          />
        ))}
      </div>
    </>
  );
}
