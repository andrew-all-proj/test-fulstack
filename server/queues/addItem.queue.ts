import { allIdsSet } from "../store/store";
import { AddItemResult } from "../../shared/types";

type AddItemJob = {
  id: number;
  resolve: (value: AddItemResult) => void;
  reject: (reason?: any) => void;
};

export class AddItemQueue {
  private jobs: AddItemJob[] = [];

  constructor(private readonly intervalMs: number) {
    setInterval(() => this.flush().catch(console.error), intervalMs);
  }

  enqueue(id: number): Promise<AddItemResult> {
    return new Promise<AddItemResult>((resolve, reject) => {
      this.jobs.push({ id, resolve, reject });
    });
  }

  private async flush(): Promise<void> {
    const jobs = this.jobs;
    this.jobs = [];
    if (!jobs.length) return;

    const uniqueIds = new Set<number>();
    for (const job of jobs) uniqueIds.add(job.id);

    const results = new Map<number, AddItemResult>();

    for (const id of uniqueIds) {
      if (!Number.isInteger(id) || id <= 0) {
        results.set(id, { ok: false, reason: "invalid id" });
        continue;
      }
      if (allIdsSet.has(id)) {
        results.set(id, { ok: false, reason: "already exists" });
        continue;
      }
      allIdsSet.add(id);
      results.set(id, { ok: true });
    }

    for (const job of jobs) {
      job.resolve(results.get(job.id)!);
    }
  }
}
