import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ItemDto } from './dto/item.dto';
import { ItemsService } from './items.service';
import { Item } from 'src/database/entities/item.entity';
import { RequestHeader } from 'src/common/decorators/request-header.decorator';
import { XUserHeaders } from 'src/common/dto/x-user-headers.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(
    @Body() body: ItemDto,
    @RequestHeader(XUserHeaders) xUserHeaders: XUserHeaders,
  ): Promise<Item> {
    return this.itemsService.create(body, xUserHeaders['X-User-Id']);
  }

  @Get('/my')
  async findUserItems(
    @RequestHeader(XUserHeaders) xUserHeaders: XUserHeaders,
  ): Promise<Item[]> {
    return this.itemsService.findBySellerId(xUserHeaders['X-User-Id']);
  }

  @Get()
  async find(@Query('category_id') categoryId: number) {
    if (categoryId) {
      return this.itemsService.findByCategoryId(categoryId);
    }

    return this.itemsService.findAll();
  }
}
