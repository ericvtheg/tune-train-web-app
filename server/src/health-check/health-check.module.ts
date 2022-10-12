import { Module } from '@nestjs/common';
import { HealthCheckController } from 'src/health-check/health-check.controller';

@Module({
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
