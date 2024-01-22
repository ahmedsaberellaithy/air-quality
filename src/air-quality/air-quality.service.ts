import { Inject, Injectable } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirQuality, ReadingsSource } from './air-quality.entity';
import { AirQualityApi } from './air-quality.interface';
import { IQAirAirQualityProvider } from './providers/iqair-air-quality.provider';

@Injectable()
export class AirQualityService {
  constructor(
    @InjectRepository(AirQuality)
    private readonly airQualityRepository: Repository<AirQuality>,
    @Inject(IQAirAirQualityProvider)
    private readonly airQualityApi: AirQualityApi,
  ) {}

  async getPollutionData(
    latitude: string,
    longitude: string,
  ): Promise<{
    pollution: any;
  }> {
    const airQualityData = await this.airQualityApi.getAirQuality(
      latitude,
      longitude,
    );

    const airQuality = this.airQualityRepository.create({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      pollutionData: airQualityData.pollution,
      aqius: airQualityData.aqius,
      readingTime: new Date(),
      dataSource: ReadingsSource.iqAir,
    });

    await this.airQualityRepository.save(airQuality);

    return {
      pollution: airQualityData.pollution,
    };
  }

  async getMostPollutedTime(
    latitude: string,
    longitude: string,
  ): Promise<{
    mostPolluted: Date;
    pollutionData: any;
  }> {
    const mostPolluted = await this.airQualityRepository
      .createQueryBuilder('airQuality')
      .where(`airQuality.latitude = ${latitude}`)
      .andWhere(`airQuality.longitude = ${longitude}`)
      .orderBy('aqius', 'DESC')
      .getOne();

    return {
      mostPolluted: mostPolluted.readingTime,
      pollutionData: mostPolluted.pollutionData,
    };
  }

  @Cron('*/1 * * * *')
  async scheduledAirQualityCheck(): Promise<void> {
    /** Longitude and Latitude for Paris Zone */
    const latitude = '48.856613';
    const longitude = '2.352222';

    console.log(
      `Scheduled Job for storing air quality data for ${latitude}, ${longitude}`,
    );

    try {
      await this.getPollutionData(latitude, longitude);
    } catch (error) {
      console.error('Error during cronjob of storing air quality job', {
        errorMessage: error.message,
        longitude,
        latitude,
      });
    }
  }
}
