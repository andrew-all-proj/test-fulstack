import { useCallback, useRef } from "react";

export function useInfiniteScroll(
  loadMore: () => void,
  hasMore: boolean,
  loading: boolean
) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el || !hasMore || loading) return;

    const threshold = 100;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  const setRef = (node: HTMLDivElement | null) => {
    if (ref.current) {
      ref.current.removeEventListener("scroll", onScroll);
    }
    ref.current = node;
    if (ref.current) {
      ref.current.addEventListener("scroll", onScroll);
    }
  };

  return setRef;
}
