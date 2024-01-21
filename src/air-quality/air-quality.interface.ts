export interface AirQualityApi {
  getAirQuality(
    latitude: string,
    longitude: string,
  ): Promise<{
    pollution: Record<string, unknown>;
  }>;
}
