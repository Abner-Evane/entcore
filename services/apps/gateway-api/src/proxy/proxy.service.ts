import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * ProxyService forwards HTTP requests to the Java monolith.
 * The monolith base URL is configured via the MONOLITH_BASE_URL env var.
 */
@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly monolithBaseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.monolithBaseUrl = process.env.MONOLITH_BASE_URL ?? 'http://localhost:8090';
  }

  async forward(
    method: string,
    path: string,
    headers: Record<string, string>,
    body?: unknown,
  ): Promise<AxiosResponse> {
    const url = `${this.monolithBaseUrl}${path}`;
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: this.sanitizeHeaders(headers),
      data: body,
      validateStatus: () => true,
    };

    this.logger.debug(`Forwarding ${method} ${path} → ${url}`);
    return firstValueFrom(this.httpService.request(config));
  }

  private sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const excluded = ['host', 'content-length', 'connection'];
    return Object.fromEntries(
      Object.entries(headers).filter(([key]) => !excluded.includes(key.toLowerCase())),
    );
  }
}
