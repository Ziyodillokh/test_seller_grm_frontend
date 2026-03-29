// hooks/useInfiniteScroll.ts
import { useEffect } from "react";

interface UseInfiniteScrollOptions {
  enabled?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  targetRef: React.RefObject<HTMLElement>;
}

export function useInfiniteScroll({
  enabled = true,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  targetRef,
}: UseInfiniteScrollOptions) {
  useEffect(() => {
    if (!enabled || !fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const el = targetRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [enabled, hasNextPage, isFetchingNextPage, fetchNextPage, targetRef]);
}
