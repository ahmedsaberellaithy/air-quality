import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  exports: [ConfigModule], // export ConfigModule to make it available for injection in other modules
})
export class AppConfigModule {}
