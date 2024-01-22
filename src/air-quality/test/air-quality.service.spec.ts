import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityService } from './../air-quality.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirQuality, ReadingsSource } from './../air-quality.entity';
import { AirQualityApi } from './../air-quality.interface';
import { IQAirAirQualityProvider } from './../providers/iqair-air-quality.provider';

describe('AirQualityService', () => {
  let airQualityService: AirQualityService;
  let airQualityRepository: Repository<AirQuality>;
  let airQualityApi: AirQualityApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        {
          provide: getRepositoryToken(AirQuality),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: IQAirAirQualityProvider,
          useValue: { getAirQuality: jest.fn() },
        },
      ],
    }).compile();

    airQualityService = module.get<AirQualityService>(AirQualityService);
    airQualityRepository = module.get<Repository<AirQuality>>(
      getRepositoryToken(AirQuality),
    );
    airQualityApi = module.get<AirQualityApi>(IQAirAirQualityProvider);
  });

  it('should be defined', () => {
    expect(airQualityService).toBeDefined();
  });

  describe('getPollutionData', () => {
    it('should save air quality data to repository and return pollution', async () => {
      const airQualityData = {
        pollution: {
          ts: '2024-01-19T10:00:00.000Z',
          aqius: 22,
          mainus: 'o3',
          aqicn: 20,
          maincn: 'o3',
        },
        aqius: 22,
      };
      const airQualityApiSpy = jest
        .spyOn(airQualityApi, 'getAirQuality')
        .mockResolvedValue(airQualityData);

      const createSpy = jest.spyOn(airQualityRepository, 'create');
      const saveSpy = jest.spyOn(airQualityRepository, 'save');

      const result = await airQualityService.getPollutionData(
        '48.856613',
        '2.352222',
      );

      expect(airQualityApiSpy).toHaveBeenCalledWith('48.856613', '2.352222');
      expect(result).toEqual({ pollution: airQualityData.pollution });
      expect(createSpy).toHaveBeenCalledWith({
        latitude: parseFloat('48.856613'),
        longitude: parseFloat('2.352222'),
        pollutionData: airQualityData.pollution,
        aqius: airQualityData.aqius,
        readingTime: expect.any(Date),
        dataSource: ReadingsSource.iqAir,
      });
      expect(saveSpy).toHaveBeenCalled();
    });

    it('should proxy error in air quality api', async () => {
      const airQualityApiSpy = jest
        .spyOn(airQualityApi, 'getAirQuality')
        .mockRejectedValue(new Error('test error'));

      const createSpy = jest.spyOn(airQualityRepository, 'create');
      const saveSpy = jest.spyOn(airQualityRepository, 'save');

      await expect(() =>
        airQualityService.getPollutionData('48.856613', '2.352222'),
      ).rejects.toThrow('test error');

      expect(airQualityApiSpy).toHaveBeenCalledWith('48.856613', '2.352222');
      expect(createSpy).not.toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('getMostPollutedTime', () => {
    const latitude = '48.856613';
    const longitude = '2.352222';

    it('should return most polluted time and pollution data', async () => {
      const mockMostPolluted = {
        pollutionData: {
          ts: '2024-01-19T10:00:00.000Z',
          aqius: 22,
          mainus: 'o3',
          aqicn: 20,
          maincn: 'o3',
        },
        aqius: 22,
        readingTime: new Date('2024-01-19T10:00:00.000Z'),
      };

      jest
        .spyOn(airQualityRepository, 'createQueryBuilder')
        .mockReturnValueOnce({
          orderBy: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValueOnce(mockMostPolluted),
        } as any);

      const result = await airQualityService.getMostPollutedTime(
        latitude,
        longitude,
      );

      expect(result.mostPolluted).toEqual(new Date('2024-01-19T10:00:00.000Z'));
      expect(result.pollutionData).toEqual({
        ts: '2024-01-19T10:00:00.000Z',
        aqius: 22,
        mainus: 'o3',
        aqicn: 20,
        maincn: 'o3',
      });
    });
  });

  describe('scheduledAirQualityCheck', () => {
    it('should call getPollutionData during cronjob, and successfully end', async () => {
      /**
       * Spying on logs is a good practice if you are using custom logger
       * e.g. kibana or datadog, to make sure errors/info are passed to the log service properly
       */
      jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(console, 'error').mockImplementation();

      const getPollutionDataSpy = jest
        .spyOn(airQualityService, 'getPollutionData')
        .mockResolvedValue({
          pollution: {
            ts: '2024-01-19T10:00:00.000Z',
            aqius: 22,
            mainus: 'o3',
            aqicn: 20,
            maincn: 'o3',
          },
        });

      await airQualityService.scheduledAirQualityCheck();

      expect(getPollutionDataSpy).toHaveBeenCalledWith('48.856613', '2.352222');
      expect(console.log).toHaveBeenCalledWith(
        'Scheduled Job for storing air quality data for 48.856613, 2.352222',
      );
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should call getPollutionData and handle error returned', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(console, 'error').mockImplementation();

      const getPollutionDataSpy = jest
        .spyOn(airQualityService, 'getPollutionData')
        .mockRejectedValue(new Error('error message'));

      await airQualityService.scheduledAirQualityCheck();

      expect(getPollutionDataSpy).toHaveBeenCalledWith('48.856613', '2.352222');
      expect(console.log).toHaveBeenCalledWith(
        'Scheduled Job for storing air quality data for 48.856613, 2.352222',
      );
      expect(console.error).toHaveBeenCalledWith(
        'Error during cronjob of storing air quality job',
        {
          errorMessage: 'error message',
          latitude: '48.856613',
          longitude: '2.352222',
        },
      );
    });
  });
});
