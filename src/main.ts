import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';

  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://email.csnguyen.de',
    'https://katharinaniesche.de',
    'https://katy.csnguyen.de',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Reject 'null' origin and allow only specified origins
      if (isProduction && origin === null) {
        callback(new Error('CORS: null origin is not allowed'));
      } else if (allowedOrigins.includes(origin)) {
        callback(null, true); // Allow requests from allowed origins
      } else {
        callback(new Error('Not allowed by CORS')); // Reject other origins
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies or authentication headers
  });

  // Enable Swagger only in development environment
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API description for the application')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
