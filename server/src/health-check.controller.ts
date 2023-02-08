import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('health-check')
export class HealthCheckController {
  @Public()
  @Get()
  async healthCheck(): Promise<string>{
    return 'healthy';
  }
}
