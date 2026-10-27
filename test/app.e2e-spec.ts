import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppController } from './../src/app.controller';
import { EmailModule } from './../src/email/email.module';
import { EmailService } from './../src/email/email.service';
import { User } from './../src/user/schemas/user.schema';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const sendMail = jest.fn().mockResolvedValue({});

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [() => ({ SMTP_USER: 'sender@example.com' })],
        }),
        EmailModule,
      ],
      controllers: [AppController],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    (app.get(EmailService) as any).transporter = { sendMail };
    sendMail.mockClear();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body.status).toBe('ok');
  });

  it('/email/send (POST)', async () => {
    await request(app.getHttpServer())
      .post('/email/send')
      .send({
        fromName: 'Thomas Müller',
        to: 'recipient@example.com',
        subject: 'Hello',
        text: 'Test',
      })
      .expect(201)
      .expect({ message: 'Email sent successfully!' });

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"Thomas Müller" <sender@example.com>',
        to: 'recipient@example.com',
        subject: 'Hello',
      }),
    );
  });
});
