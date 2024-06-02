import { Module } from '@nestjs/common';
import { ItemsController } from './items.http.controller';
import { ItemsService } from './items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/database/entities/item.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { ItemsMicroserviceController } from './items.microservice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), CategoriesModule],
  controllers: [ItemsController, ItemsMicroserviceController],
  providers: [ItemsService],
})
export class ItemsModule {}
