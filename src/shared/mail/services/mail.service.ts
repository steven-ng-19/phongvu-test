import { BadRequestException, Injectable } from '@nestjs/common';

import { MAIL_TEMPLATE } from '../constants';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailType } from '../types';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailToAccount({ email, title, template, url }: SendMailType) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: title,
        template: template,
        context: {
          url,
        },
      });
      return {
        message: 'Email was sent successfully',
      };
    } catch (error) {
      console.log(error);
    }
  }
}
