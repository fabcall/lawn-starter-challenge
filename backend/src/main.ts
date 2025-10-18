import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AllConfigType } from './config/config.type';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);

  const port = configService.getOrThrow('app.port', { infer: true });
  const nodeEnv = configService.getOrThrow('app.nodeEnv', { infer: true });

  const corsOrigin = configService.getOrThrow('cors.origin', { infer: true });
  const corsCredentials = configService.getOrThrow('cors.credentials', {
    infer: true,
  });

  app.enableCors({
    origin: corsOrigin,
    credentials: corsCredentials,
  });

  app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`🎮 GraphQL Playground: http://localhost:${port}/graphql`);
  console.log(`🌍 Environment: ${nodeEnv}`);
}
bootstrap();
