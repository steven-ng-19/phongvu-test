import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import { QUEUE_NAMES } from './constants';
import { JobType } from 'src/common/types';

export const DefaultOptions: JobOptions = {
  attempts: 3,
  removeOnComplete: false,
};
@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.AUTH_QUEUE) private readonly _authQueue: Queue,
  ) {}

  async addJob(job: JobType) {
    const { queueName, processName, data, opt } = job;
    switch (queueName) {
      case QUEUE_NAMES.AUTH_QUEUE:
        console.log(job.queueName);
        this._authQueue.add(processName, data, opt);
        break;
      default:
        throw new BadRequestException('Queue not found');
    }
  }
}
