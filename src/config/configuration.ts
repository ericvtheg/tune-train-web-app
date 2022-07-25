export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  songsBucket: process.env.SONGS_BUCKET,
  stage: process.env.STAGE,
  database: {
    host: process.env.DATABASE_HOST,
    user: process.env.USER,
    name: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
});