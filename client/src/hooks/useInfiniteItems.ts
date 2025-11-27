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
    async (offset: number, searchValue?: string) => {
      if (loading) return;
      setLoading(true);
      try {
        const normalized = searchValue?.trim() || "";

        const res: GetItems = await apiGetItems({
          side,
          offset,
          limit,
          search: normalized ? normalized : undefined,
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
    [loading, side]
  );

  const reload = useCallback(
    (newSearch: string) => {
      const normalized = newSearch.trim();
      setSearch(normalized);
      setItems([]);
      setHasMore(true);
      setTotal(0);
      loadPage(0, normalized);
    },
    [loadPage]
  );

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    loadPage(items.length, search);
  }, [hasMore, loading, items.length, loadPage, search]);

  useEffect(() => {
    loadPage(0, search);
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
