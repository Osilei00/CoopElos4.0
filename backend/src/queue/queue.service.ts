import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();

  private get connection() {
    const url = process.env.REDIS_URL;
    if (url) {
      const parsed = new URL(url);
      return {
        host: parsed.hostname,
        port: parseInt(parsed.port || '6379'),
      };
    }
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    };
  }

  getQueue(name: string): Queue {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, { connection: this.connection });
      this.queues.set(name, queue);
    }
    return this.queues.get(name)!;
  }

  addJob(queueName: string, jobName: string, data: any) {
    const queue = this.getQueue(queueName);
    return queue.add(jobName, data);
  }

  async onModuleDestroy() {
    for (const queue of this.queues.values()) {
      await queue.close();
    }
    for (const worker of this.workers.values()) {
      await worker.close();
    }
  }
}
