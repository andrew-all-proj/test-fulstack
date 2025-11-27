import { allIdsSet, selectedSet, selectedOrder } from "../store/store";
import type { SelectResult } from "../../shared/types";

export function selectItem(id: number): SelectResult {
  if (!allIdsSet.has(id))
    return {
      success: false,
      message: "not exists",
      selectedCount: selectedOrder.length,
    };
  if (selectedSet.has(id))
    return {
      success: false,
      message: "already",
      selectedCount: selectedOrder.length,
    };

  selectedSet.add(id);
  selectedOrder.push(id);
  return { success: true, selectedCount: selectedOrder.length };
}

export function unselectItem(id: number): SelectResult {
  if (!selectedSet.has(id))
    return {
      success: false,
      message: "not selected",
      selectedCount: selectedOrder.length,
    };
  selectedSet.delete(id);
  const idx = selectedOrder.indexOf(id);
  if (idx !== -1) selectedOrder.splice(idx, 1);
  return { success: true, selectedCount: selectedOrder.length };
}
