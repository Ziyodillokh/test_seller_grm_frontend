import { useNavigate } from "react-router-dom";

import PartiyaCard from "@/components/cards/partiya-card";
import { InfiniteLoader } from "@/components/InfiniteLoader";
import { useMeStore } from "@/store/me-store";

import usePartiyaFetch from "./queries";

export default function PartiyaList() {
    const navigate = useNavigate();
    const { meUser } = useMeStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePartiyaFetch({
      queries:{
        warehouse:meUser?.filial?.id || undefined,
      }
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <div className="mt-[22px] px-4">
      {flatData?.map((item) => (
        <PartiyaCard
          key={item?.id}
          onClick={() => navigate(`/partiya/${item?.id}`)}
          factoryTitle={item?.factory?.title}
          partiyaNoTitle={item?.partiya_no?.title}
          countryTitle={item?.country?.title}
          volume={item?.volume}
          price={0}
          date={item?.date as unknown as Date} //format(row.original.date, "dd.MM.yyyy")
          expense={item?.expense}
          status={
            item?.partiya_status == "new"
              ? "Открыто"
              : item?.partiya_status == "pending" ||
                  item?.partiya_status == "closed"
                ? "В ожидании"
                : "Закрыто"
          }
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
