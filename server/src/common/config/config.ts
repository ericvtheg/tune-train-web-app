import { plainToInstance } from 'class-transformer';
import { IsEnum, IsUrl, IsString, IsNumber, validateSync } from 'class-validator';

export enum STAGE {
  local = 'local',
  prod = 'prod'
}

class EnvironmentVariables {
  @IsNumber()
  APP_PORT: number;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  // TODO would like this to be IsUrl but fails for postgres url thing
  @IsString()
  DATABASE_URL: string;

  @IsEnum(STAGE)
  STAGE: STAGE;

  @IsString()
  SONG_BUCKET: string;

  @IsUrl({ require_tld: false })
  LISTEN_QUEUE_URL: string;

  @IsString()
  LISTEN_QUEUE_NAME: string;

  @IsString()
  AWS_REGION: string;

  @IsString()
  JWT_ACCESS_TOKEN_SECRET: string;

  @IsString()
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  JWT_REFRESH_TOKEN_SECRET: string;

  @IsString()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;
}

export interface TransformedConfig {
  appPort: number;
  fileStorage: {
    songBucket: {
      name: string;
    }
  }
  queue: {
    listenQueue: {
      url: string;
      name: string;
    }
  }
  stage: STAGE;
  database: {
    host: string;
    username: string;
    name: string;
    password: string;
    port: number;
    url: string;
  }
  aws: {
    region: string;
  }
  jwt: {
    accessTokenSecret: string;
    accessTokenExpirationTime: string;
    refreshTokenSecret: string;
    refreshTokenExpirationTime: string;
  }
}

export const validate = (config: Record<string, unknown>): EnvironmentVariables => {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};

export const loader = (): TransformedConfig => ({
  appPort: parseInt(process.env.APP_PORT as string, 10),
  fileStorage: {
    songBucket: {
      name: process.env.SONG_BUCKET as string,
    },
  },
  queue: {
    listenQueue: {
      url: process.env.LISTEN_QUEUE_URL as string,
      name: process.env.LISTEN_QUEUE_NAME as string,
    },
  },
  stage: process.env.STAGE as unknown as STAGE,
  database: {
    host: process.env.DATABASE_HOST as string,
    username: process.env.DATABASE_USER as string,
    name: process.env.DATABASE_NAME as string,
    password: process.env.DATABASE_PASSWORD as string,
    port: parseInt(process.env.DATABASE_PORT as string, 10),
    url: process.env.DATABASE_URL as string,
  },
  aws: {
    region: process.env.AWS_REGION as string,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
    accessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME as string,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
    refreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME as string,
  },
});
