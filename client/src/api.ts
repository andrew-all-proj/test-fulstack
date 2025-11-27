import { SideEnum } from "@shared/types";
import type {
  GetItems,
  GetItemsParams,
  SelectResult,
  OrderResult,
  AddItemResult,
} from "@shared/types";

const API_BASE = "";

async function jsonRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export async function apiGetItems(params: GetItemsParams): Promise<GetItems> {
  const usp = new URLSearchParams();

  const sideValue =
    params.side === SideEnum.LEFT ? SideEnum.LEFT : SideEnum.RIGHT;

  usp.set("side", sideValue);
  usp.set("offset", String(params.offset));
  usp.set("limit", String(params.limit));
  if (params.search) usp.set("search", params.search);

  return jsonRequest<GetItems>(`${API_BASE}/api/items?${usp.toString()}`);
}

export async function apiSelect(id: number): Promise<SelectResult> {
  return jsonRequest<SelectResult>(`${API_BASE}/api/select`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

export async function apiUnselect(id: number): Promise<SelectResult> {
  return jsonRequest<SelectResult>(`${API_BASE}/api/unselect`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

export async function apiOrder(ids: number[]): Promise<OrderResult> {
  return jsonRequest<OrderResult>(`${API_BASE}/api/order`, {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export async function apiAddItem(id: number): Promise<AddItemResult> {
  return jsonRequest<AddItemResult>(`${API_BASE}/api/items`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}
