import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health Check',
    description:
      'Check that application is alive, and returns the time stamp of this call.',
  })
  getHealthCheck(): { message: string; dateTime: string } {
    return this.appService.getHealthCheck();
  }
}
