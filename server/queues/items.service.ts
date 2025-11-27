import { allIdsSet, selectedSet, selectedOrder } from "../store/store";
import { GetItemsParams, GetItems, Item, SideEnum } from "../../shared/types";

export function getItems(params: GetItemsParams): GetItems {
  const { side, offset, limit, search } = params;
  const result: Item[] = [];
  let matchedCount = 0;

  if (side === SideEnum.RIGHT) {
    for (const id of selectedOrder) {
      if (search && !id.toString().includes(search)) continue;
      if (matchedCount >= offset && result.length < limit) result.push({ id });
      matchedCount++;
    }
  } else {
    for (const id of allIdsSet) {
      if (selectedSet.has(id)) continue;
      if (search && !id.toString().includes(search)) continue;
      if (matchedCount >= offset && result.length < limit) result.push({ id });
      matchedCount++;
    }
  }
  return { items: result, total: matchedCount };
}
