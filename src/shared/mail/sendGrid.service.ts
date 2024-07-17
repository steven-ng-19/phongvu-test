import * as SendGrid from '@sendgrid/mail';

import { CONFIG_VAR } from 'src/config';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

interface SendGridMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}
export type SendGridTextMessage = Omit<SendGridMessage, 'html'>;
export type SendGridHtmlMessage = Omit<SendGridMessage, 'text'>;

@Injectable()
export class SendGridService {
  constructor(private configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get(CONFIG_VAR.SENDGRID_API_KEY));
  }

  public async sendEmail(
    message: SendGridTextMessage | SendGridHtmlMessage,
  ): Promise<any> {
    return SendGrid.send(message);
  }
}
