export const INITIAL_MAX_ID = 1_000_000;

export const allIdsSet = new Set<number>();

for (let i = 1; i <= INITIAL_MAX_ID; i++) {
  allIdsSet.add(i);
}

export let selectedOrder: number[] = [];
export let selectedSet: Set<number> = new Set();

export function updateSelectedOrder(ids: number[]) {
  selectedOrder = ids;
  selectedSet = new Set(ids);
}
