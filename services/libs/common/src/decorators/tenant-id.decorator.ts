import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the tenant ID from the request headers (X-Tenant-Id).
 * All services must validate that a tenantId is present on every authenticated request.
 */
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-tenant-id'] as string;
  },
);
