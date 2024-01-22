import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AirQualityApi } from '../air-quality.interface';
import { ConfigService } from '@nestjs/config';
import { HttpProviderError } from '../errors/http-provider-error';

@Injectable()
export class IQAirAirQualityProvider implements AirQualityApi {
  constructor(private readonly configService: ConfigService) {}

  async getAirQuality(
    latitude: string,
    longitude: string,
  ): Promise<{
    pollution: any;
    aqius: number;
  }> {
    const apiKey = this.configService.get('IQAIR_API_KEY');
    const iqairBaseUrl = this.configService.get('IQAIR_API_BASE_URL');

    const apiUrl = `${iqairBaseUrl}nearest_city?lat=${latitude}&lon=${longitude}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);

      const currentAirQualityData = response.data?.data?.current;
      const currentAirQualityIndex = currentAirQualityData?.pollution?.aqius;

      /**
       * this condition is built on the data format found on IQAir Docs
       * @see https://api-docs.iqair.com/?version=latest
       */
      if (response.status !== 200 || !currentAirQualityData) {
        throw new HttpProviderError(
          'Bad Response while fetching air quality data',
          'IQAir',
          `${response.data}`,
        );
      }

      return {
        pollution: currentAirQualityData.pollution,
        aqius: parseInt(currentAirQualityIndex),
      };
    } catch (error) {
      // if this error is already a custom error, proxy the error to the upper layer.
      if (error instanceof HttpProviderError) {
        throw error;
      }

      // wrap any other response into HTTP provider Error to hide the internals of the 3rd party communications.
      throw new HttpProviderError(
        'Error while fetching air quality data',
        'IQAir',
        error.message,
      );
    }
  }
}
