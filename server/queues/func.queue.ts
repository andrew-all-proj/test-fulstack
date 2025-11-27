type FuncJob = {
  action: () => Promise<any> | any;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
};

export class FuncQueue {
  private jobs: FuncJob[] = [];

  constructor(private readonly intervalMs: number) {
    setInterval(() => this.flush().catch(console.error), intervalMs);
  }

  enqueue<T>(action: () => Promise<T> | T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.jobs.push({ action, resolve, reject });
    });
  }

  private async flush(): Promise<void> {
    const jobs = this.jobs;
    this.jobs = [];
    if (!jobs.length) return;

    for (const job of jobs) {
      try {
        const result = await job.action();
        job.resolve(result);
      } catch (err) {
        job.reject(err);
      }
    }
  }
}
