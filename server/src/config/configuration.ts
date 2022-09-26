export const configuration = (): Record<string, any> => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  songsBucket: process.env.SONGS_BUCKET,
  stage: process.env.STAGE,
  database: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USER,
    name: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  aws: {
    region: process.env.AWS_REGION,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  },
});
