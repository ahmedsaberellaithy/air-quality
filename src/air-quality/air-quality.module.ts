import { Module } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';
import { AirQualityController } from './air-quality.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQuality } from './air-quality.entity';
import { IQAirAirQualityProvider } from './providers/iqair-air-quality.provider';

@Module({
  imports: [TypeOrmModule.forFeature([AirQuality])],
  providers: [IQAirAirQualityProvider, AirQualityService, AirQualityController],
  exports: [AirQualityService, AirQualityController],
})
export class AirQualityModule {}
