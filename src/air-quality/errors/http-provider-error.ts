import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @description This is a custom error class that is thrown when a HTTP provider is not returning a positive response.
 * @param { string } message The error message (can be passed to the client)
 * @param { string } provider The name of the provider
 * @param { string } providerMessage the message passed from the 3rd party (separated to isolate it from the client)
 */

export class HttpProviderError extends HttpException {
  private readonly provider: string;
  private readonly providerMessage: string;

  constructor(message: string, provider: string, providerMessage: string) {
    super(message, HttpStatus.BAD_GATEWAY);
    this.provider = provider;
    this.providerMessage = providerMessage;
  }
}
