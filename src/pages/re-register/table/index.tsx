import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import { InfiniteLoader } from "@/components/InfiniteLoader";
import { ProductsData } from "@/pages/hame/type.ts";
import { useMeStore } from "@/store/me-store";

import Content from "./content";
// import { DataTable } from "@/components/ui/data-table";
import useDataLibrary from "./queries";
// enum ProductReportEnum {
//   SURPLUS = 'излишки',
//   DEFICIT = 'дефицит',
//   INVENTORY = 'переучет',
// }
export default function Page() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search] = useQueryState("search");
  const { meUser } = useMeStore();
  const [type] = useQueryState("tab",parseAsString.withDefault("переучет"));

  const { data , fetchNextPage, hasNextPage, isFetchingNextPage } = useDataLibrary({
    queries: {
      limit,
      page,
      search: search || undefined,
      filialId: meUser?.filial?.id || "",
      type: type,
    },
  });

  // const flatData = (data?.pages?.[0]?.items || []) as unknown as ProductsData[];
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  return (
    <div className=" w-full">
      <Content isBacket={true} data={flatData as unknown as ProductsData[] || []} />
      <InfiniteLoader
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
