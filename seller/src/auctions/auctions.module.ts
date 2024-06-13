import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AUCTION_SERVICE } from 'src/transport-config/constants';
import { ClientProxyFactoryWrapper } from 'src/transport-config/client-proxy-factory-wrapper.service';
import { TransportConfigModule } from 'src/transport-config/transport-config.module';

@Module({
  imports: [TransportConfigModule],
  providers: [
    AuctionsService,
    {
      provide: AUCTION_SERVICE,
      useFactory: (clientProxyFactoryWrapper: ClientProxyFactoryWrapper) =>
        clientProxyFactoryWrapper.getAuctionServiceClientProxy(),
      inject: [ClientProxyFactoryWrapper],
    },
  ],
  exports: [AuctionsService],
})
export class AuctionsModule {}