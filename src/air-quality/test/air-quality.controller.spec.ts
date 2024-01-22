import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityController } from '../air-quality.controller';
import { AirQualityService } from '../air-quality.service';

describe('AirQualityController', () => {
  let airQualityController: AirQualityController;
  let airQualityService: AirQualityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AirQualityService,
          useValue: {
            getPollutionData: jest.fn(),
            getMostPollutedTime: jest.fn(),
          },
        },
      ],
      controllers: [AirQualityController],
    }).compile();

    airQualityService = module.get<AirQualityService>(AirQualityService);
    airQualityController =
      module.get<AirQualityController>(AirQualityController);
  });

  it('should be defined', () => {
    expect(airQualityController).toBeDefined();
  });

  describe('Get Pollution Data API', () => {
    it('should return pollution data as returned from service (200 HTTP status code)', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockResult = {
        pollution: {
          ts: '2024-01-19T10:00:00.000Z',
          aqius: 22,
          mainus: 'o3',
          aqicn: 20,
          maincn: 'o3',
        },
      };
      jest
        .spyOn(airQualityService, 'getPollutionData')
        .mockResolvedValue(mockResult);

      const longitude = '2.352222';
      const latitude = '48.856613';

      await airQualityController.getPollutionData(
        longitude,
        latitude,
        mockResponse,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        result: { pollution: mockResult.pollution },
      });

      expect(mockResponse.status).toHaveBeenCalledWith(200);

      expect(airQualityService.getPollutionData).toHaveBeenCalledWith(
        longitude,
        latitude,
      );
    });

    it('should return error message as returned from service (500 HTTP status code)', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest
        .spyOn(airQualityService, 'getPollutionData')
        .mockRejectedValue(new Error('Error Message'));

      const longitude = '2.352222';
      const latitude = '48.856613';

      await airQualityController.getPollutionData(
        longitude,
        latitude,
        mockResponse,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        result: undefined,
        message: 'Error Message',
      });

      expect(mockResponse.status).toHaveBeenCalledWith(500);

      expect(airQualityService.getPollutionData).toHaveBeenCalledWith(
        longitude,
        latitude,
      );
    });
  });

  describe('Get Most Polluted Time API', () => {
    const latitude = '48.856613';
    const longitude = '2.352222';

    it('should return pollution data as returned from service (200 HTTP status code)', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockResult = {
        mostPolluted: new Date('2024-01-19T10:00:00.000Z'),
        pollutionData: {
          ts: '2024-01-19T10:00:00.000Z',
          aqius: 22,
          mainus: 'o3',
          aqicn: 20,
          maincn: 'o3',
        },
      };
      jest
        .spyOn(airQualityService, 'getMostPollutedTime')
        .mockResolvedValue(mockResult);

      await airQualityController.getMostPollutedTime(mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        result: mockResult,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(200);

      expect(airQualityService.getMostPollutedTime).toHaveBeenCalledWith(
        latitude,
        longitude,
      );
    });

    it('should return error message as returned from service (500 HTTP status code)', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest
        .spyOn(airQualityService, 'getMostPollutedTime')
        .mockRejectedValue(new Error('Error Message'));

      await airQualityController.getMostPollutedTime(mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        result: undefined,
        message: 'Error Message',
      });

      expect(mockResponse.status).toHaveBeenCalledWith(500);

      expect(airQualityService.getMostPollutedTime).toHaveBeenCalledWith(
        latitude,
        longitude,
      );
    });
  });
});
