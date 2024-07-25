import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';

import { AUTH_QUEUE_PROCESS_NAME } from 'src/modules/auth/constants';
import { AuthQueueService } from 'src/modules/auth/services';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../constants';

@Processor(QUEUE_NAMES.AUTH_QUEUE)
export class AuthConsumer extends WorkerHost {
  constructor(private readonly _authQueueService: AuthQueueService) {
    super();
  }

  @OnWorkerEvent('active')
  onWorkerActive(job: Job) {
    console.log('active', job.name);
  }

  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case AUTH_QUEUE_PROCESS_NAME.RESET_PASSWORD:
        return this._authQueueService.handleSendEmailResetPassword(job.data);
      default:
        throw new Error('Queue not found');
    }
  }
}
