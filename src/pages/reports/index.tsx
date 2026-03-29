
import { useState } from "react";

import { InfiniteLoader } from "@/components/InfiniteLoader";

import { useMeStore } from "@/store/me-store";

import Content from "./content";
import useOrderByUser from "./queries";

export default function ReportPage() {
  const { meUser } = useMeStore();
  const [years] = useState<string>((new Date().getFullYear()).toString());
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString());



  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useOrderByUser({
    queries: {
      tip: "order",
      sellerId: meUser?.id || "",
      month: month,
      year: years
    }
  })

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  return (
    <>
      <Content setMonth={setMonth} month={month} list={flatData} reports={data?.pages?.[0]?.totals} />
      <InfiniteLoader
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  )
}
