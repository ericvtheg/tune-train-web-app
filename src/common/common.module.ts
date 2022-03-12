import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GlobalGuard } from './guards/global.guard';

@Module({
  providers: [{ provide: APP_GUARD, useClass: GlobalGuard }],
})
export class CommonModule {}
