import { Module } from '@nestjs/common';
import { ClientProxyFactoryWrapper } from './client-proxy-factory-wrapper.service';
import { QueueConfigService } from './queue-config.service';

@Module({
  providers: [ClientProxyFactoryWrapper, QueueConfigService],
  exports: [ClientProxyFactoryWrapper, QueueConfigService],
})
export class TransportConfigModule {}
