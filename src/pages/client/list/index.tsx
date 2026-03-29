import { useQueryState } from "nuqs";
import { useNavigate } from "react-router-dom";

import ClientCard from "@/components/cards/client-card";
import { InfiniteLoader } from "@/components/InfiniteLoader";
import { useMeStore } from "@/store/me-store";

import ActionPage from "../form";
import useClientsData from "./queries";

export default function ClientList() {
  const { meUser } = useMeStore();
  const [id] = useQueryState("id");
  const navigate = useNavigate()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useClientsData({
      queries: {
        filial: meUser?.filial?.id || undefined,
      },
    });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <div className="px-4 py-6">
      {id ? <ActionPage /> : ""}

      {flatData.map((item) => (
        <ClientCard
          id={item?.id}
          key={item?.id}
          fullName={item?.fullName}
          phone={item?.phone}
          given={item?.given}
          owed={item?.owed}
          onClick={()=>navigate(`/client/${item?.id}`)}
          comment={item?.comment}
        />
      ))}
      <InfiniteLoader
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
