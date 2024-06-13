import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import rabbitmqConfig, {
  RABBITMQ_CONFIG_NAME,
  RabbitMQConfig,
} from './config/rabbitmq.config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/.${process.env.NODE_ENV}.env`,
      load: [rabbitmqConfig],
    }),
  );
  const config = appContext.get(ConfigService);

  const { url, auctionQueue } =
    config.get<RabbitMQConfig>(RABBITMQ_CONFIG_NAME);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: auctionQueue,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();

  appContext.close();
}
bootstrap();
