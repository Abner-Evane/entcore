import { NodeSDK } from '@opentelemetry/sdk-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

/**
 * Initialize OpenTelemetry tracing.
 * Must be called before any NestJS bootstrap code.
 *
 * @param serviceName  Name used to identify this service in traces.
 * @param jaegerUrl    Jaeger collector HTTP endpoint (default: http://localhost:14268/api/traces)
 */
export function initTracing(
  serviceName: string,
  jaegerUrl = 'http://localhost:14268/api/traces',
): NodeSDK {
  const exporter = new JaegerExporter({ endpoint: jaegerUrl });

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
    traceExporter: exporter,
    instrumentations: [new HttpInstrumentation(), new NestInstrumentation()],
  });

  sdk.start();

  process.on('SIGTERM', async () => {
    await sdk.shutdown();
  });

  return sdk;
}
