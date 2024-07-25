import { JobOptions } from 'bull';

export type JobType = {
  queueName: string;
  processName: string;
  data: any;
  opt: JobOptions;
};
