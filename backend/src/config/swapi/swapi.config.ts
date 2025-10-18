import { registerAs } from '@nestjs/config';

import { IsInt, IsOptional, IsUrl, Max, Min } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

import { SwapiConfig } from './swapi-config.type';

class EnvironmentVariablesValidator {
  @IsUrl({ require_tld: false })
  @IsOptional()
  SWAPI_BASE_URL: string;

  @IsInt()
  @Min(1000)
  @Max(60000)
  @IsOptional()
  SWAPI_TIMEOUT: number;
}

export default registerAs<SwapiConfig>('swapi', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    baseUrl: process.env.SWAPI_BASE_URL || 'https://swapi.dev/api',
    timeout: process.env.SWAPI_TIMEOUT
      ? parseInt(process.env.SWAPI_TIMEOUT, 10)
      : 10000,
  };
});
