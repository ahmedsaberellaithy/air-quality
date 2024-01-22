import { Controller, Get, Response, Query } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Air Quality and Pollution Data')
@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Get('most-polluted-time')
  @ApiOperation({
    summary: 'Get most polluted time',
    description:
      'Returns the highest pollution reading stored in the database (hardcoded now for paris zone).',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred',
  })
  async getMostPollutedTime(@Response() response): Promise<{
    status: 'success' | 'error';
    result: { mostPolluted: Date; pollutionData: any } | undefined;
    message?: string;
  }> {
    try {
      /** Longitude and Latitude for Paris Zone */
      const latitude = '48.856613';
      const longitude = '2.352222';

      /**
       * Most polluted data for this task is filtered for paris zone
       * This function can be extended to have more zones
       */
      const mostPollutedData = await this.airQualityService.getMostPollutedTime(
        latitude,
        longitude,
      );

      return response.status(200).json({
        status: 'success',
        result: mostPollutedData,
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        result: undefined,
        message: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get Pollution Data',
    description:
      'Returns an object containing the pollution data for the given coordinates.' +
      'test using cairo zone data: latitude: 30.0274, longitude: 31.2272',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred',
  })
  async getPollutionData(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Response() response,
  ): Promise<{
    status: 'success' | 'error';
    result: { pollution: any } | undefined;
    message?: string;
  }> {
    try {
      const airQuality = await this.airQualityService.getPollutionData(
        latitude,
        longitude,
      );

      return response.status(200).json({
        status: 'success',
        result: {
          pollution: airQuality.pollution,
        },
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        result: undefined,
        message: error.message,
      });
    }
  }
}
