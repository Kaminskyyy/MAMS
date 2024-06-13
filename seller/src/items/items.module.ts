import { Module } from '@nestjs/common';
import { ItemsController } from './items.http.controller';
import { ItemsService } from './items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/database/entities/item.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { ItemsMicroserviceController } from './items.microservice.controller';
import { AUCTION_SERVICE } from 'src/transport-config/constants';
import { ClientProxyFactoryWrapper } from 'src/transport-config/client-proxy-factory-wrapper.service';
import { TransportConfigModule } from 'src/transport-config/transport-config.module';
import { AuctionsModule } from 'src/auctions/auctions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    CategoriesModule,
    TransportConfigModule,
    AuctionsModule,
  ],
  controllers: [ItemsController, ItemsMicroserviceController],
  providers: [
    ItemsService,
    {
      provide: AUCTION_SERVICE,
      useFactory: (clientProxyFacoryWrapper: ClientProxyFactoryWrapper) =>
        clientProxyFacoryWrapper.getAuctionServiceClientProxy(),
      inject: [ClientProxyFactoryWrapper],
    },
  ],
})
export class ItemsModule {}
