import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';

@Controller()
export class HealthCheckController {
  constructor() {}

  @Public()
  @Get()
  async healthCheck(): Promise<string>{
    return 'healthy';
  }
}
