import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';

// TODO would like to specify endpoint path for this

@Controller()
export class HealthCheckController {
  @Public()
  @Get()
  async healthCheck(): Promise<string>{
    return 'healthy';
  }
}
