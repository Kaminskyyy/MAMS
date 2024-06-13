import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BUYER_SERVICE } from 'src/transport-config/constants';
import { ClientProxyFactoryWrapper } from 'src/transport-config/client-proxy-factory-wrapper.service';
import { TransportConfigModule } from 'src/transport-config/transport-config.module';

@Module({
  imports: [TransportConfigModule],
  providers: [
    BidsService,
    {
      provide: BUYER_SERVICE,
      useFactory: (clientProxyFactoryWrapper: ClientProxyFactoryWrapper) =>
        clientProxyFactoryWrapper.getBuyerServiceClientProxy(),
      inject: [ClientProxyFactoryWrapper],
    },
  ],
  exports: [BidsService],
})
export class BidsModule {}
