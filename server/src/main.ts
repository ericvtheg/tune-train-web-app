import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { WrapResponseInterceptor } from 'src/common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from 'src/common/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { TransformedConfig, STAGE } from "src/common/config/config";
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.use(helmet());
  // TODO why the heck do I need to pass this generic every dang time
  const config = app.get(ConfigService<TransformedConfig, true>);

  const stage = config.get<STAGE>('stage');

  // app.useGlobalPipes();

  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(new Reflector()),
  );

  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Swagger Module
  const options = new DocumentBuilder()
    .setTitle('FindArtists')
    .setDescription('Find up and coming artists')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  if (stage === 'local') {
    app.enableCors({ credentials: true, origin: true });
  }

  const port = config.get<number>('appPort');
  await app.listen(port);
}
bootstrap();
