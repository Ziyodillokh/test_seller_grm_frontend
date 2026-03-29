import { getMonth, getYear } from "date-fns";
import { Building2, ChartPie, ChevronLeft, Layers2, Store } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

import BossCard from "@/components/cards/boss-card";
import FilterComboboxDemoInput from "@/components/filter/filterCombobox";
import { InfiniteLoader } from "@/components/InfiniteLoader";

import {
  useCollectionRemaining,
  useCollectionRemainingfactory,
  useRemainingProductsCollection,
} from "../../queries";
import {
  CollectionRemainingFactory,
  RemainingProductsCollection,
} from "../../type";

export default function BossStock() {
  const [filial] = useQueryState("filial");
  const [typeOther] = useQueryState("type", parseAsString.withDefault("none"));
  const [month] = useQueryState(
    "month",
    parseAsInteger.withDefault(getMonth(new Date()) + 1)
  );
  const [year] = useQueryState(
    "year",
    parseAsInteger.withDefault(getYear(new Date()))
  );
  const [, setCollectionId] = useQueryState("collectionId", parseAsString);
  const [, setCollectionName] = useQueryState("collectionName", parseAsString);
  const [, setSelect] = useQueryState(
    "select",
    parseAsString.withDefault("Products")
  );

  const [remainingProductsCollectionId, setRemainingProductsCollectionId] =
    useState<RemainingProductsCollection["data"][0]["country"] | null>(null);
  const [collectionRemainingId, setCollectionRemainingId] = useState<
    CollectionRemainingFactory["data"][0]["factory"] | null
  >(null);

  const {
    data: remainingProductsCollection,
    isLoading: idLoadingProductsCollection,
  } = useRemainingProductsCollection({
    queries: {
      month: month || undefined,
      year: year || undefined,
      filialId: filial || undefined,
      limit: 100,
      typeOther
    },
  });

  const {
    data: collectionRemainingfactory,
    isLoading: idLoadingCollectionFactory,
  } = useCollectionRemainingfactory({
    queries: {
      country: remainingProductsCollectionId?.id || undefined,
      month: month || undefined,
      year: year || undefined,
      filialId: filial || undefined,
      limit: 100,
      typeOther
    },
    enabled: Boolean(remainingProductsCollectionId),
  });

  const {
    data: collectionRemaining,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: idLoadingCollection,
  } = useCollectionRemaining({
    queries: {
      month: month || undefined,
      year: year || undefined,
      filialId: filial || undefined,
      factory: collectionRemainingId?.id || undefined,
      limit: 10,
      typeOther,
    },
    enabled: Boolean(collectionRemainingId),
  });

  const flatCollectionRemaining =
    collectionRemaining?.pages?.flatMap((page) => page?.data || []) || [];

  return (
    <>
      <div className=" flex w-full gap-2 px-2.5">
        {remainingProductsCollectionId || collectionRemainingId ? (
          <p
            onClick={() => {
              if (collectionRemainingId) {
                setCollectionRemainingId(null);
              } else if (remainingProductsCollectionId) {
                setRemainingProductsCollectionId(null);
              }
            }}
            className="p-2 cursor-pointer  text-[#45453C] text-[14px] flex w-full items-center gap-[5px] rounded-[6px] bg-background border-border border mb-[24px]"
          >
            {remainingProductsCollectionId && <ChevronLeft size={20} />}
            {collectionRemainingId
              ? collectionRemainingId?.title
              : remainingProductsCollectionId
                ? remainingProductsCollectionId?.title
                : ""}
          </p>
        ) : (
          <FilterComboboxDemoInput
            className="w-1/2  h-[36px] bg-white rounded-[8px] border border-white"
            placeholder="Type"
            isAll={false}
            defaultValue="none"
            name="type"
            option={[
              {
                label: "Отчет об остатке",
                value: "none",
              },
              {
                label: "Отчет о продажах",
                value: "other",
              },
            ]}
            isFilter={false}
            fieldNames={{ label: "title", value: "id" }}
          />
        )}
        <FilterComboboxDemoInput
          className="w-full  h-[36px] mb-[22px] bg-white rounded-[8px] border border-white"
          placeholder="Все филиалы"
          fetchUrl="/filial/warehouse-and-filial"
          name="filial"
          isFilter={false}
          disabled={
            Boolean(remainingProductsCollectionId) ||
            Boolean(collectionRemainingId)
          }
          icons={
            <>
              <Store width={20} height={20} />
            </>
          }
          fieldNames={{ label: "title", value: "id" }}
        />
      </div>

      {!remainingProductsCollectionId && (
        <BossCard
          rowOne={true}
          topWidth={300}
          pricelast={
            (remainingProductsCollection?.meta?.totals?.totalPrice?.toFixed(
              2
            ) || 0) + " $"
          }
          plaasticSum={
            (remainingProductsCollection?.meta?.totals?.totalKv?.toFixed(2) ||
              0) + " м²"
          }
          iconComponent={() => (
            <ChartPie
              className={`p-3 w-14 h-14 $ bg-white text-primary rounded-[12px]`}
            />
          )}
          isLoading={idLoadingProductsCollection}
          filial={"Все филиалы и склады"}
          colums={
            remainingProductsCollection?.data
              ? remainingProductsCollection?.data?.map((item) => ({
                  label: item?.country?.title,
                  onClick: () => {
                    setRemainingProductsCollectionId(item?.country);
                  },
                  values: [
                    item?.totalKv?.toFixed(2) + "м²",
                    item?.totalPrice?.toFixed(2) + "$",
                    typeOther == "none" ? item?.totalCount + " шт": item?.totalNetProfitPrice?.toFixed(2) + "$",
                  ],
                }))
              : []
          }
        />
      )}

      {remainingProductsCollectionId && !collectionRemainingId && (
        <BossCard
          rowOne={true}
          isLoading={idLoadingCollectionFactory}
          title="Поставщикам"
          iconComponent={() => (
            <Building2
              className={`p-3 w-12 h-12 $ bg-white text-primary rounded-[12px]`}
            />
          )}
          filial={"Все Поставщики"}
          colums={
            collectionRemainingfactory?.data?.map((item) => ({
              label: item?.factory?.title,
              onClick: () => {
                setCollectionRemainingId(item?.factory);
              },
              values: [
                (+item?.totalKv)?.toFixed(2) + " м²",
                Number(item?.totalPrice)?.toFixed(2) + " $",
                typeOther == "none" ? item?.totalCount + " шт": item?.totalNetProfitPrice?.toFixed(2) + "$",
              ],
            })) || []
          }
        />
      )}

      {collectionRemainingId && (
        <BossCard
          title="Коллекциям"
          rowOne={true}
          isLoading={idLoadingCollection}
          iconComponent={() => (
            <Layers2
              className={`p-3 w-12 h-12 $ bg-white text-primary rounded-[12px]`}
            />
          )}
          filial={"Все филиалы и склад"}
          colums={
            flatCollectionRemaining?.map((item) => ({
              label: item?.collection?.title,
              onClick: () => {
                setSelect("BossModel");
                setCollectionId(item?.collection?.id);
                setCollectionName(item?.collection?.title);
              },
              values: [
                item?.totalKv?.toFixed(2) + " м²",
                item?.totalPrice.toFixed(2) + " $",
                typeOther == "none" ? item?.totalCount + " шт": item?.totalNetProfitPrice?.toFixed(2) + "$",
              ],
            })) || []
          }
        />
      )}

      {collectionRemainingId && (
        <InfiniteLoader
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </>
  );
}
