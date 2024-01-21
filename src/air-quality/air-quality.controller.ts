import { Controller, Get, Response, Query } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';

@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Get()
  async getAirQuality(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Response() response,
  ): Promise<{
    status: 'success' | 'error';
    result: { pollution: Record<string, unknown> } | undefined;
    message?: string;
  }> {
    try {
      const airQuality = await this.airQualityService.getAirQuality(
        latitude,
        longitude,
      );

      return response.status(200).send({
        status: 'success',
        result: {
          pollution: airQuality.pollution,
        },
      });
    } catch (error) {
      return response.status(500).send({
        status: 'error',
        result: undefined,
        message: error.message,
      });
    }
  }
}
