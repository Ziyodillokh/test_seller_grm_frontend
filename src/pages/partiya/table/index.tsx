import {  parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";

import { InfiniteLoader } from "@/components/InfiniteLoader";

import Content from "./content";
import useDataFetch from "./queries";

export default function Page() {
  const [search] = useQueryState("search");
  const {id}= useParams()
  const [tab] = useQueryState(
    "tab",
    parseAsString.withDefault("переучет")
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useDataFetch({
    queries: {
      search: search || undefined,
      partiyaId: id || "",
      type:  "default" ,
      tip:tab === "new" ? undefined : tab,
    },
  });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  return (
    <div className=" w-full">
      <Content isBacket={true} data={flatData || []} />

      <InfiniteLoader
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
