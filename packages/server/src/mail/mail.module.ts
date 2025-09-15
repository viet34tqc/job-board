import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { validate } from 'class-validator';
import { join } from 'path';
import configuration from 'src/core/config/configuration';
import { JobSchema } from 'src/jobs/jobs.schema';
import { SubscriberSchema } from 'src/subscribers/schemas/subscriber.schema';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      skipProcessEnv: true,
      validate,
      load: [configuration],
    }),
    MongooseModule.forFeature([
      { name: 'Subscriber', schema: SubscriberSchema },
      { name: 'Job', schema: JobSchema },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('emailHost'),
          secure: false,
          auth: {
            user: configService.get<string>('smtpUser'),
            pass: configService.get<string>('smtpPassword'),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
