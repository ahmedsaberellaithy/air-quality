import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// maintaining the source for extendability to be able to use any other providers later
export enum ReadingsSource {
  iqAir = 'IQAIR',
}

@Entity({ name: 'air-quality' })
export class AirQuality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'float' })
  latitude: number;

  /**
   * @description Air Quality Index US is a standard index referring to pollution data
   * The main aim to separate this specific piece of info, is to sort readings.
   * @see https://www.airnow.gov/aqi/aqi-basics/
   */
  @Column({ type: 'integer' })
  aqius: number;

  @Column({ name: 'reading-time', type: 'timestamp' })
  readingTime: Date;

  @Column({
    name: 'reading-source',
    type: 'enum',
    enum: ReadingsSource,
    default: ReadingsSource.iqAir,
  })
  dataSource: ReadingsSource;

  @Column({ name: 'pollution-data', type: 'json' })
  pollutionData: any;
}
