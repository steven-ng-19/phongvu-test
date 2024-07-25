import { DefaultOptions, QueueService } from 'src/shared/queues/queue.service';
import { MAIL_TEMPLATE, MAIL_TITLE } from 'src/shared/mail/constants';

import { AUTH_QUEUE_PROCESS_NAME } from '../constants';
import { Injectable } from '@nestjs/common';
import { JobType } from 'src/common/types';
import { MailService } from 'src/shared/mail/services';
import { QUEUE_NAMES } from 'src/shared/queues/constants';

@Injectable()
export class AuthQueueService {
  constructor(
    private readonly _queueService: QueueService,
    private readonly _mailService: MailService,
  ) {}

  async addJobSendEmailResetPassword(email: string, url: string) {
    console.log('auth queue service');
    await this._queueService.addJob({
      queueName: QUEUE_NAMES.AUTH_QUEUE,
      processName: AUTH_QUEUE_PROCESS_NAME.RESET_PASSWORD,
      data: { email, url },
      opt: DefaultOptions,
    });
  }

  async handleSendEmailResetPassword({ email, url }) {
    try {
      const result = await this._mailService.sendEmailToAccount({
        email,
        url,
        title: MAIL_TITLE.RESET_TITLE,
        template: MAIL_TEMPLATE.RESET_TEMPLATE,
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
