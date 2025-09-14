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
      template: 'jobs',
      context: {
        subject: 'New Job Opportunities', // This will be available as {{subject}} in the template
        jobs: [
          {
            title: 'Senior Software Engineer', // This will be available as {{this.title}} in the template
            company: 'Tech Corp',
            type: 'Full-time',
            location: 'Remote',
            salary: '$80,000 - $100,000',
            description:
              'We are looking for an experienced software engineer...',
            applyUrl: 'https://example.com/apply/123',
          },
        ],
        currentYear: new Date().getFullYear(),
        companyName: 'Your Company',
      },
    });
  }
}
