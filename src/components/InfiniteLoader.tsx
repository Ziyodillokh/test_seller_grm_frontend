// components/InfiniteLoader.tsx
import { Loader } from "lucide-react";
import { useRef } from "react";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface InfiniteLoaderProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function InfiniteLoader({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteLoaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useInfiniteScroll({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    targetRef: ref,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return ( 
    <>
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      fetchNextPage ?  <div
      ref={ref}
      className="min-h-10 flex items-center justify-center text-center"
    >
      {isFetchingNextPage ? <Loader className="animate-spin" /> : ""}
    </div>:""
    }
   
    </>
    )

 
}
