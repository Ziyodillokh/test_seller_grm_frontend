import { parseAsInteger, useQueryState } from "nuqs";

import { TData } from "../types";
import Content from "./content";
import useDataFetch from "./queries";

export default function NotePage() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const { data } = useDataFetch({
    queries: {
      limit,
      page,
    },
  });

  const flatData = (data?.pages?.[0]?.items || []) as unknown as TData[];
  return (
    <>
      <Content data={flatData} />
    </>
  );
}
