import { Module, DynamicModule } from '@nestjs/common';
import { NatsPublisherService } from './nats-publisher.service';
import { NATS_CONNECTION } from './nats.constants';
import { connect, NatsConnection } from 'nats';

export interface MessagingModuleOptions {
  servers: string | string[];
}

@Module({})
export class MessagingModule {
  static forRoot(options: MessagingModuleOptions): DynamicModule {
    const natsProvider = {
      provide: NATS_CONNECTION,
      useFactory: async (): Promise<NatsConnection> => {
        return connect({ servers: options.servers });
      },
    };

    return {
      module: MessagingModule,
      providers: [natsProvider, NatsPublisherService],
      exports: [NatsPublisherService, NATS_CONNECTION],
      global: true,
    };
  }
}
