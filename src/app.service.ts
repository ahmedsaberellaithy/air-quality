import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * @description a health check endpoint used only to make sure the project is running
   * having the date as a plus (for monitoring if the server is done what was the last active time.)
   * @returns { message: string; dateTime: string }
   */
  getHealthCheck(): { message: string; dateTime: string } {
    return {
      message: 'I am alive!',
      dateTime: new Date().toISOString(),
    };
  }
}
