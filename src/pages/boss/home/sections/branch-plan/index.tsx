import { useMutation } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import { toast } from "sonner";

import { InfiniteLoader } from "@/components/InfiniteLoader";
import { UpdateData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import debounce from "@/utils/debounce";

import { useBranchPlan } from "../../queries";
import BossFilialCard from "../../ui/boss-filial-card";
import { getMonth, getYear } from "date-fns";



import { useState } from "react";
import PlanSellers from "./plan-sellers";

export default function BranchPlan() {
  const [selectedFilial, setSelectedFilial] = useState<{ id: string; title: string } | null>(null);
  const [search] = useQueryState("search");
  const [year] = useQueryState(
    "year",
    parseAsInteger.withDefault(getYear(new Date()))
  );
  const [month] = useQueryState(
    "month",
    parseAsInteger.withDefault(getMonth(new Date()) + 1)
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useBranchPlan(
    {
      year: year,
      queries: {
        limit: 10,
        page: 1,
        month,
        search: search || undefined,
      },
    }
  );
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  const { mutate } = useMutation({
    mutationFn: async ({ id, body }: {
      id: string, body: {
        price: string,
        year: number,
      }
    }) => {
      return await UpdateData(apiRoutes.filialPlan, encodeURIComponent(id) || '', body);
    },
    onSuccess: () => {
      toast.success("План успешно изменен");
    },
  });

  if (selectedFilial) {
    return (
      <PlanSellers
        filialId={selectedFilial.id}
        setFilialId={setSelectedFilial}
        filialName={selectedFilial.title}
        year={year || "2026"}
      />
    );
  }

  return (
    <>
      <div className=" border-border border-b mb-5 flex">
        <p className=" p-[20px] py-3 border-border border-r  text-[14px] w-full">
          <p> Планка:</p>
          <span className="font-bold ">
            {new Intl.NumberFormat("ru-RU")
              .format(
                flatData.reduce(
                  (acc, curr) => acc + Number(curr.plan_price || 0),
                  0
                )
              )
              .replace(/,/g, " ")}
            $
          </span>
        </p>
        <p className=" p-[20px] py-3 border-border border-r  text-[14px] w-full">
          <p> Сделанны:</p>
          <span className="font-bold text-[#89A143]">
            {new Intl.NumberFormat("ru-RU")
              .format(
                flatData.reduce((acc, curr) => acc + Number(curr?.earn || 0), 0)
              )
              .replace(/,/g, " ")}
            $
          </span>
        </p>
      </div>
      <div className="mx-2.5">
        {flatData &&
          flatData?.map((item) => (
            <div
              key={item?.filialId}
              onClick={() => {
                if (item.filialId != "#dealer") {
                  setSelectedFilial({
                    id: item.filialId,
                    title: item.filialTitle,
                  });
                }
              }}
              className="cursor-pointer"
            >
              <BossFilialCard
                filial={item?.filialTitle}
                year={year}
                yearlyGoal={item?.plan_price}
                collectedAmount={item?.earn}
                handleLocalChange={debounce((value) => mutate({ id: item?.filialId, body: { price: value, year } }), 500)}
              />
            </div>
          ))}
        <InfiniteLoader
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
