import { selectedOrder, updateSelectedOrder } from "../store/store";
import type { OrderResult } from "../../shared/types";

export function reorderSelected(ids: number[]): OrderResult {
  const setCurr = new Set(selectedOrder);
  const setNew = new Set(ids);
  if (setCurr.size !== setNew.size)
    return { success: false, count: selectedOrder.length };
  for (const id of selectedOrder)
    if (!setNew.has(id)) return { success: false, count: selectedOrder.length };
  updateSelectedOrder(ids);
  return { success: true, count: ids.length };
}
