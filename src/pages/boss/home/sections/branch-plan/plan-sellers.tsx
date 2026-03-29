
import { ChevronLeft, Loader2, Store } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Dispatch, SetStateAction } from "react";

import FilterComboboxDemoInput from "@/components/filter/filterCombobox";
import TebleAvatar from "@/components/teble-avatar";
import { usePlanSellersFetch } from "../../queries";
import { SellerInPlan } from "../../type";

interface IPlanSellersProps {
    filialId: string | null;
    setFilialId: Dispatch<SetStateAction<{ id: string; title: string } | null>>;
    year?: string | number | null;
    filialName?: string | null;
}

export default function PlanSellers({
    filialId,
    setFilialId,
    year,
    filialName
}: IPlanSellersProps) {
    const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
    const [page] = useQueryState("page", parseAsInteger.withDefault(1));

    const [monthPlanFilials] = useQueryState("monthPlanFilials");
    const { data, isLoading, fetchNextPage, hasNextPage } = usePlanSellersFetch({
        filialId,
        year,
        queries: {
            page,
            limit,
            month: monthPlanFilials ? Number(monthPlanFilials) : undefined
        }
    });

    const sellers = data?.pages?.flatMap((page) => page?.items || []) || [];

    return (
        <>
            <div className="flex w-full gap-2 px-2.5">
                <p
                    onClick={() => setFilialId(null)}
                    className="p-2 cursor-pointer text-[#45453C] text-[14px] flex w-full items-center gap-[5px] rounded-[6px] bg-background border-border border mb-[24px]"
                >
                    <ChevronLeft size={20} /> назад
                </p>
                <FilterComboboxDemoInput
                    className="w-full h-[36px] mb-[22px] bg-white rounded-[8px] border border-white"
                    placeholder="Все филиалы"
                    fetchUrl="/filial/warehouse-and-filial"
                    name="filial"
                    defaultValue={filialId || undefined}
                    isFilter={false}
                    disabled={true}
                    option={filialId && filialName ? [{ value: filialId, label: filialName }] : []}
                    icons={
                        <>
                            <Store width={20} height={20} />
                        </>
                    }
                    fieldNames={{ label: "title", value: "id" }}
                />
            </div>

            <div className="px-5  flex flex-col gap-4 py-4 h-[calc(100vh-200px)] overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : (
                    sellers.length === 0 ? (
                        <p className="text-center text-gray-500">Empty List</p>
                    ) : (
                        <>
                            {sellers.map((item: SellerInPlan) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center border-b border-border pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-2">
                                        <TebleAvatar status={"none"} name={item?.firstName} url={item?.avatar?.path} />

                                        <h4 className="font-medium text-[14px]">
                                            {item?.firstName} {item?.lastName}
                                        </h4>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <div className="text-[14px]">
                                            <span className="text-gray-500">Планка:</span>{" "}
                                            <span className="font-bold">
                                                {new Intl.NumberFormat("ru-RU")
                                                    .format(Number(item?.plan_price || 0))
                                                    .replace(/,/g, " ")}{" "}
                                                $
                                            </span>
                                        </div>
                                        <div className="text-[14px]">
                                            <span className="text-gray-500">Сделано :</span>{" "}
                                            <span className="font-bold text-[#89A143]">
                                                {new Intl.NumberFormat("ru-RU")
                                                    .format(Number(item?.earn || 0))
                                                    .replace(/,/g, " ")}{" "}
                                                $
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div
                                ref={(ref) => {
                                    if (ref) {
                                        const observer = new IntersectionObserver(
                                            (entries) => {
                                                if (entries[0].isIntersecting && hasNextPage) {
                                                    fetchNextPage();
                                                }
                                            },
                                            { threshold: 1 }
                                        );
                                        observer.observe(ref);
                                        return () => observer.disconnect();
                                    }
                                }}
                                className="h-10 w-full"
                            />
                        </>
                    )
                )}
            </div>
        </>
    );
}
