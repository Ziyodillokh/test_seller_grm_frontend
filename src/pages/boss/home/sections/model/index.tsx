import { getMonth, getYear } from "date-fns";
import {  ChevronLeft, Layers2, Store } from "lucide-react";
import {  parseAsInteger, parseAsString, useQueryState } from "nuqs";

import BossCard from "@/components/cards/boss-card";
import FilterComboboxDemoInput from "@/components/filter/filterCombobox";
import { InfiniteLoader } from "@/components/InfiniteLoader";

import { useModelsReport } from "../../queries";


export default function BossModel() {
  const [filial] = useQueryState("filial");
  const [collectionId] = useQueryState("collectionId",parseAsString)
  const [collectionName] = useQueryState("collectionName",parseAsString)
  const [,setModelId] = useQueryState("modelId",parseAsString)
  const [,setModelName] = useQueryState("modelName",parseAsString)

  const [,setSelect] = useQueryState(
    "select",
    parseAsString.withDefault("Products")
  );
  const [month] = useQueryState(
    "month",
    parseAsInteger.withDefault(getMonth(new Date()) + 1)
  );
  const [year] = useQueryState(
    "year",
    parseAsInteger.withDefault(getYear(new Date()))
  );
  const [typeOther] = useQueryState("type", parseAsString.withDefault("none"));
  const {
    data: ModelsRepor,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: idLoadingCollection,
  } = useModelsReport({
    queries: {
      filialId: filial || undefined,
      collectionId: collectionId || undefined,
      limit: 10,
      month: month || undefined,
      year: year || undefined,
      typeOther
    },
  });

  const flatModelsReporg =
  ModelsRepor?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <div className=" flex w-full gap-2 px-2.5">
        {
          <p
          onClick={()=>setSelect("StockBalance")}
            className="p-2 cursor-pointer  text-[#45453C] text-[14px] flex w-full items-center gap-[5px] rounded-[6px] bg-background border-border border mb-[24px]"
          >
           <ChevronLeft size={20} /> {collectionName}
          </p>
        }
        <FilterComboboxDemoInput
          className="w-full  h-[36px] mb-[22px] bg-white rounded-[8px] border border-white"
          placeholder="Все филиалы"
          fetchUrl="/filial/warehouse-and-filial"
          name="filial"
          defaultValue={filial || undefined}
          isFilter={false}
          disabled={true}
          icons={
            <>
              <Store width={20} height={20} />
            </>
          }
          fieldNames={{ label: "title", value: "id" }}
        />
      </div>
      <BossCard
          title="Модели"
          rowOne={true}
          isLoading={idLoadingCollection}
          iconComponent={() => (
            <Layers2
              className={`p-3 w-12 h-12 $ bg-white text-primary rounded-[12px]`}
            />
          )}
          filial={"Все филиалы и склад"}
          colums={
            flatModelsReporg?.map((item) => ({
              label: item?.title,
              onClick:()=>{
                setSelect("BossSize")
                setModelId(item?.id)
                setModelName(item?.title)
              },
              values: [
                item?.totalKv + " м²",
                item?.totalKvPrice + " $",
                typeOther == "none" ? item?.totalCount + " шт": item?.totalNetProfitPrice?.toFixed(2) + "$",
              ],
            })) || []
          }
        />

        <InfiniteLoader
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
    </>
  );
}
