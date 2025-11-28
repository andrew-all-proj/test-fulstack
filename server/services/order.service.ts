import {
  selectedOrder,
  selectedSet,
  updateSelectedOrder,
} from "../store/store";
import type { OrderResult } from "../../shared/types";

export function reorderSelected(ids: number[]): OrderResult {
  const setNew = new Set(ids);
  if (setNew.size !== ids.length) {
    return { success: false, count: selectedOrder.length };
  }
  for (const id of ids) {
    if (!selectedSet.has(id)) {
      return { success: false, count: selectedOrder.length };
    }
  }

  let idx = 0;
  const orderedIds = [...selectedOrder];
  for (let i = 0; i < orderedIds.length && idx < ids.length; i++) {
    if (setNew.has(orderedIds[i])) {
      orderedIds[i] = ids[idx++];
    }
  }

  updateSelectedOrder(orderedIds);
  return { success: true, count: ids.length };
}
