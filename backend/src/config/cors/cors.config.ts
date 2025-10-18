import { registerAs } from '@nestjs/config';

import { IsBoolean, IsOptional, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

import { CorsConfig } from './cors-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  CORS_ORIGIN: string;

  @IsBoolean()
  @IsOptional()
  CORS_CREDENTIALS: boolean;
}

export default registerAs<CorsConfig>('cors', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: process.env.CORS_CREDENTIALS === 'true' || true,
  };
});
