import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get } from '@nestjs/common';
import { IsPublic } from 'src/auth/decoratots/auth.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailerService) {}

  @Get()
  @IsPublic()
  async handleTestMail() {
    await this.mailService.sendMail({
      to: 'viet34tqc@gmail.com',
      from: '"Viet Nguyen" <viet34tqc@gmail.com>',
      subject: 'test mail',
      template: 'mail',
    });
  }
}
