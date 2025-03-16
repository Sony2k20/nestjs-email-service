import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  controllers: [AppController],
  imports: [
    // ServeStaticModule setup
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'), // Static assets directory
      serveRoot: '/assets', // URL path to access the assets (optional)
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().default(587),
        SMTP_USER: Joi.string().required(),
        SMTP_PASS: Joi.string().required(),
      }),
    }),
    EmailModule,
  ],
})
export class AppModule {}
