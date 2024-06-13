import { Module } from '@nestjs/common';
import { ClientProxyFactoryWrapper } from './client-proxy-factory-wrapper.service';

@Module({
  providers: [ClientProxyFactoryWrapper],
  exports: [ClientProxyFactoryWrapper],
})
export class TransportConfigModule {}
