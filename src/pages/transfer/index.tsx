import { useQueryState } from "nuqs";

import { InfiniteLoader } from "@/components/InfiniteLoader";
import { useMeStore } from "@/store/me-store";

import { useProduct } from "../hame/queries";
import TransferContent from "./content";
import TabBar from "./tab-bar";

export default function Transfer() {
  const [search] = useQueryState("search");
  const { meUser } = useMeStore();
  const [id] = useQueryState("id");
  const { data,refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useProduct({
    queries: {
      limit: 10,
      page: 1,
      search: search ||id || undefined,
      filialId:  meUser?.filial?.id || "",
    },
  });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  return (
  <>
    { meUser?.position?.role == 0 ? "": <TabBar/>}
     <TransferContent  
      refetch={refetch}
        isBacket={false}
        data={flatData || []}
       />
     <InfiniteLoader
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
  </>
  )
}
