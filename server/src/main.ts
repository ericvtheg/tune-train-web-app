import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { WrapResponseInterceptor } from 'src/common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from 'src/common/interceptors/timeout.interceptor';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { TransformedConfig, STAGE } from 'src/common/config/config';
import helmet from 'helmet';
import { Settings } from 'luxon';
import { PasswordHashPipe } from 'src/common/pipes/password-hash.pipe';
import { PasswordService } from 'src/auth/password.service';

async function bootstrap() {
  Settings.defaultZone = 'utc';

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.use(helmet());
  // TODO why the heck do I need to pass this generic every dang time
  const config = app.get(ConfigService<TransformedConfig, true>);

  const stage = config.get<STAGE>('stage');

  const passwordService = app.get(PasswordService);
  app.useGlobalPipes(new PasswordHashPipe(passwordService));

  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(new Reflector())
  );

  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  if (stage === 'local') {
    app.enableCors({ credentials: true, origin: true });
  }

  const port = config.get<number>('appPort');
  await app.listen(port);
}
bootstrap();
