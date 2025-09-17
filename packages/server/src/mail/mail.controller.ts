import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IsPublic } from 'src/auth/decoratots/auth.decorator';
import { Job, JobDocument } from 'src/jobs/jobs.schema';
import {
  Subscriber,
  SubscriberDocument,
} from 'src/subscribers/schemas/subscriber.schema';

@ApiTags('Mail')
@ApiBearerAuth('token')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailerService,

    @InjectModel(Subscriber.name)
    private readonly subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private readonly jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  @Get()
  @IsPublic()
  @Cron('0 0 0 * * 0') // run at 0h0' every sunday
  async handleTestMail() {
    const subscribers = await this.subscriberModel.find({}).exec();
    for (const subscriber of subscribers) {
      const subSkills = subscriber.skills;
      const jobMatchingSkills = await this.jobModel
        .find({ skills: { $in: subSkills } })
        .exec();
      const jobList = jobMatchingSkills.map((job) => ({
        name: job.name,
        company: job.company.name,
        skills: job.skills,
        salary: job.salary,
      }));
      await this.mailService.sendMail({
        to: 'viet34tqc@gmail.com',
        from: '"Viet Nguyen" <viet34tqc@gmail.com>',
        subject: 'test mail',
        template: 'jobs',
        context: {
          subject: 'New Job Opportunities', // This will be available as {{subject}} in the template
          jobList: jobList,
          unsubscribeUrl: 'https://example.com/unsubscribe',
          currentYear: new Date().getFullYear(),
          companyName: 'Your Company',
        },
      });
    }
  }
}
