import { AppConfig } from './app/app-config.type';
import { CorsConfig } from './cors/cors-config.type';
import { RedisConfig } from './redis/redis-config.type';
import { SwapiConfig } from './swapi/swapi-config.type';

export type AllConfigType = {
  app: AppConfig;
  cors: CorsConfig;
  redis: RedisConfig;
  swapi: SwapiConfig;
};
