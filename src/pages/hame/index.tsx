// import { useQueryState } from "nuqs";

import { useQueryState } from "nuqs";

import { InfiniteLoader } from "@/components/InfiniteLoader";
import { useMeStore } from "@/store/me-store";

import Content from "./content";
import { FilialData, useProduct, useUserFiles } from "./queries";
// import useProduct from "./queries";

export default function HomePage() {

  const [search] = useQueryState("search");
  const [id] = useQueryState("id");
  const [tab] = useQueryState("tab");
  const { meUser } = useMeStore();
  
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProduct({
      queries: {
        limit: 1,
        page: 1,
        search: search || id || undefined,
        filialId: tab || meUser?.filial?.id || "",
      },
    });

  const filels = useUserFiles({
    queries: {
      limit: 1000,
      page: 1,
      search: search || id || undefined,
    },
  });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <div>
      <Content
        refetch={refetch}
        isBacket={false}
        data={flatData || []}
        tabList={filels?.data as unknown as FilialData[]}
      />
      <InfiniteLoader
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}