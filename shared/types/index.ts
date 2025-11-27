export type Item = { id: number };

export const SideEnum = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const;

export type SideEnum = (typeof SideEnum)[keyof typeof SideEnum];

export interface GetItemsParams {
  side: SideEnum;
  offset: number;
  limit: number;
  search?: string;
}

export interface GetItems {
  items: Item[];
  total: number;
}

export interface SelectResult {
  success: boolean;
  message?: string;
  selectedCount: number;
}

export interface OrderResult {
  success: boolean;
  count: number;
}

export interface AddItemResult {
  ok: boolean;
  reason?: string;
}
