import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private requestCounter: Counter;

  constructor() {
    // Vérifie si la métrique existe déjà
    const existing = register.getSingleMetric('nestjs_requests_total');
    if (existing) {
      this.requestCounter = existing as Counter;
    } else {
      this.requestCounter = new Counter({
        name: 'nestjs_requests_total',
        help: 'Total number of requests to the NestJS app',
      });
      register.registerMetric(this.requestCounter);
    }
  }

  incrementRequestCounter(): void {
    this.requestCounter.inc();
  }
}
