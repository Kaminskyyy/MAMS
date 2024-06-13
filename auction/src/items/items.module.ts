import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { SELLER_SERVICE } from 'src/transport-config/constants';
import { ClientProxyFactoryWrapper } from 'src/transport-config/client-proxy-factory-wrapper.service';
import { TransportConfigModule } from 'src/transport-config/transport-config.module';

@Module({
  imports: [TransportConfigModule],
  providers: [
    ItemsService,
    {
      provide: SELLER_SERVICE,
      useFactory: (clientProxyFactoryWrapper: ClientProxyFactoryWrapper) =>
        clientProxyFactoryWrapper.getSellerServiceClientProxy(),
      inject: [ClientProxyFactoryWrapper],
    },
  ],
  exports: [ItemsService],
})
export class ItemsModule {}
