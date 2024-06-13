import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import {
  RABBITMQ_CONFIG_NAME,
  RabbitMQConfig,
} from 'src/config/rabbitmq.config';

@Injectable()
export class ClientProxyFactoryWrapper {
  constructor(private readonly configService: ConfigService) {}

  getSellerServiceClientProxy() {
    const { url, sellerQueue } =
      this.configService.get<RabbitMQConfig>(RABBITMQ_CONFIG_NAME);

    return this.rabbitmqFactory(url, sellerQueue);
  }

  getAuctionServiceClientProxy() {
    const { url, auctionQueue } =
      this.configService.get<RabbitMQConfig>(RABBITMQ_CONFIG_NAME);

    return this.rabbitmqFactory(url, auctionQueue);
  }

  private rabbitmqFactory(url: string, queue: string) {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue,
        queueOptions: {
          durable: true,
        },
      },
    });
  }
}
