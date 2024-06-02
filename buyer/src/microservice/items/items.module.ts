import { Module } from '@nestjs/common';
import { TransportConfigModule } from '../transport-config/transport-config.module';
import { SELLER_SERVICE } from '../transport-config/constants';
import { ClientProxyFactoryWrapper } from '../transport-config/client-proxy-factory-wrapper.service';
import { ItemsService } from './items.service';

@Module({
  imports: [TransportConfigModule],
  providers: [
    ItemsService,
    {
      provide: SELLER_SERVICE,
      useFactory: (clientProxyFacoryWrapper: ClientProxyFactoryWrapper) =>
        clientProxyFacoryWrapper.getSellerServiceClientProxy(),
      inject: [ClientProxyFactoryWrapper],
    },
  ],
  exports: [ItemsService],
})
export class ItemsModule {}
