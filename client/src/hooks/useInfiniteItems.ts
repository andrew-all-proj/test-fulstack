import { useCallback, useEffect, useState } from "react";
import { apiGetItems } from "../api";
import type { GetItems, Item, SideEnum } from "@shared/types";

export function useInfiniteItems(side: SideEnum, refreshKey = 0) {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 20;

  const loadPage = useCallback(
    async (offset: number, searchValue = search) => {
      if (loading) return;
      setLoading(true);
      try {
        const res: GetItems = await apiGetItems({
          side,
          offset,
          limit,
          search: searchValue || undefined,
        });

        if (offset === 0) {
          setItems(res.items);
        } else {
          setItems((prev) => [...prev, ...res.items]);
        }

        setTotal(res.total);
        setHasMore(offset + res.items.length < res.total);
      } catch (e) {
        console.error("Failed to load items:", e);
      } finally {
        setLoading(false);
      }
    },
    [loading, search, side]
  );

  const reload = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);
      loadPage(0, newSearch);
    },
    [loadPage]
  );

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    loadPage(items.length);
  }, [hasMore, loading, items.length, loadPage]);

  useEffect(() => {
    loadPage(0);
  }, [side, refreshKey]);

  return {
    items,
    setItems,
    search,
    setSearch: reload,
    hasMore,
    loadMore,
    loading,
    total,
    limit,
  };
}
