import 'dotenv/config';
import * as joi from 'joi';

interface EnvSchema {
  DB_CONEXION: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  APP_URL: string;
  NODE_ENV: string;
  PORT: number;
  API_VERSION: string;
  APP_NAME: string;

  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;

  SWAGGER_TITLE: string;
  SWAGGER_DESCRIPTION: string;
  SWAGGER_VERSION: string;
  SWAGGER_TAG: string;
}

const envsSchema = joi
  .object<EnvSchema>({
    DB_CONEXION: joi.string().required(),

    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().required(),

    APP_URL: joi.string().required(),
    NODE_ENV: joi.string().required(),
    PORT: joi.number().required(),
    API_VERSION: joi.string().required(),
    APP_NAME: joi.string().required(),

    THROTTLE_TTL: joi.number().required(),
    THROTTLE_LIMIT: joi.number().required(),

    SWAGGER_TITLE: joi.string().required(),
    SWAGGER_DESCRIPTION: joi.string().required(),
    SWAGGER_VERSION: joi.string().required(),
    SWAGGER_TAG: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env) as {
  error: joi.ValidationError | null;
  value: EnvSchema;
};

if (error) {
  throw new Error(`Invalid environment variables: ${error.message}`);
}

export const envs = {
  database: {
    url: value.DB_CONEXION,
  },
  jwt: {
    secret: value.JWT_SECRET,
    expiration: value.JWT_EXPIRES_IN,
  },
  api: {
    port: value.PORT,
    url: value.APP_URL,
    version: value.API_VERSION,
    env: value.NODE_ENV,
    name: value.APP_NAME,
  },
  swagger: {
    title: value.SWAGGER_TITLE,
    description: value.SWAGGER_DESCRIPTION,
    version: value.SWAGGER_VERSION,
    tag: value.SWAGGER_TAG,
  },
  throttle: {
    ttl: value.THROTTLE_TTL,
    limit: value.THROTTLE_LIMIT,
  },
};
