import { Test, TestingModule } from '@nestjs/testing';
import { IQAirAirQualityProvider } from './iqair-air-quality.provider';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HttpProviderError } from '../errors/http-provider-error';

jest.mock('axios');

describe('IQAirAirQualityProvider', () => {
  let provider: IQAirAirQualityProvider;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IQAirAirQualityProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    provider = module.get<IQAirAirQualityProvider>(IQAirAirQualityProvider);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAirQuality', () => {
    it('should fetch air quality data successfully', async () => {
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('API_KEY')
        .mockReturnValueOnce('API_BASE_URL');

      const mockResponse = {
        status: 200,
        data: {
          data: {
            current: {
              pollution: {
                ts: '2024-01-19T10:00:00.000Z',
                aqius: 42,
                mainus: 'o3',
                aqicn: 44,
                maincn: 'o3',
              },
            },
          },
        },
      };
      jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

      const result = await provider.getAirQuality('48.856613', '2.352222');

      expect(result).toEqual({
        pollution: {
          ts: '2024-01-19T10:00:00.000Z',
          aqius: 42,
          mainus: 'o3',
          aqicn: 44,
          maincn: 'o3',
        },
        aqius: 42,
      });
    });

    it('should throw HttpProviderError for bad response', async () => {
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('API_KEY')
        .mockReturnValueOnce('API_BASE_URL');

      const mockResponse = {
        status: 500,
        data: 'Internal Server Error',
      };
      jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

      await expect(
        provider.getAirQuality('48.856613', '2.352222'),
      ).rejects.toThrow(
        new HttpProviderError(
          'Bad Response while fetching air quality data',
          'IQAir',
          'Internal Server Error',
        ),
      );
    });

    it('should throw HttpProviderError for missing air quality data', async () => {
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('API_KEY')
        .mockReturnValueOnce('API_BASE_URL');

      const mockResponse = {
        status: 200,
        data: {
          data: {},
        },
      };
      jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

      await expect(
        provider.getAirQuality('48.856613', '2.352222'),
      ).rejects.toThrow(
        new HttpProviderError(
          'Bad Response while fetching air quality data',
          'IQAir',
          '{}',
        ),
      );
    });

    it('should throw HttpProviderError for network error', async () => {
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('API_KEY')
        .mockReturnValueOnce('API_BASE_URL');

      jest.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'));

      await expect(
        provider.getAirQuality('48.856613', '2.352222'),
      ).rejects.toThrow(
        new HttpProviderError(
          'Error while fetching air quality data',
          'IQAir',
          'Network Error',
        ),
      );
    });

    it('should throw HttpProviderError to proxy custom error', async () => {
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('API_KEY')
        .mockReturnValueOnce('API_BASE_URL');

      jest
        .spyOn(axios, 'get')
        .mockRejectedValue(
          new HttpProviderError('Custom Error', 'Provider', 'Details'),
        );

      await expect(
        provider.getAirQuality('48.856613', '2.352222'),
      ).rejects.toThrow(
        new HttpProviderError('Custom Error', 'Provider', 'Details'),
      );
    });
  });
});
