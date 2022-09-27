import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class HealthCheckController {
  constructor() {}

  @Public()
  @Get()
  async healthCheck(){
    return "healthy";
  } 
}
