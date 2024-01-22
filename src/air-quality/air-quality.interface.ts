/**
 * Using the interface is helpful at our case
 * to give the flexibility to change the providers at anytime
 */
export interface AirQualityApi {
  getAirQuality(
    latitude: string,
    longitude: string,
  ): Promise<{
    pollution: any;
    aqius: number;
  }>;
}
