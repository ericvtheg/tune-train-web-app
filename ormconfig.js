module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: process.env === 'local' ? true : false,
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationDir: 'src/migrations',
  },
};
