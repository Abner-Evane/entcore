import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

/**
 * Catch-all controller that forwards every request to the Java monolith.
 * As NestJS microservices are extracted, specific routes will be added
 * before this catch-all and will shadow it for those paths.
 */
@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response): Promise<void> {
    const upstream = await this.proxyService.forward(
      req.method,
      req.originalUrl,
      req.headers as Record<string, string>,
      req.body,
    );

    res.status(upstream.status);
    for (const [key, value] of Object.entries(upstream.headers)) {
      if (value !== undefined) {
        res.setHeader(key, value as string);
      }
    }
    res.send(upstream.data);
  }
}
