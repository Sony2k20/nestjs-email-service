import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const env = process.env.NODE_ENV || 'dev';

  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://email.csnguyen.de',
    'https://katharinaniesche.de',
    'https://katy.csnguyen.de',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (env !== 'dev' && origin === null) {
        callback(new Error('CORS: null origin is not allowed'));
      } else if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies or authentication headers
  });

  if (env === 'dev') {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API description for the application')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
