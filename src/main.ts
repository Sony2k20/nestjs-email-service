import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:3000',
    'http://https://email-service.csnguyen.de',
    'https://katharinaniesche.de',
    'https://katy.csnguyen.de',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        // Allow requests with no origin (like Postman) or from allowed origins
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'POST',
    credentials: true, // Allow cookies if needed
  });
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Email App')
    .setDescription('API to send emails')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
