import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REDIS_CONFIG_NAME, RedisConfig } from 'src/config/redis.config';

@Injectable()
export class QueueConfigService {
  constructor(private readonly configService: ConfigService) {}

  getQueueConfig() {
    const { host, port } =
      this.configService.get<RedisConfig>(REDIS_CONFIG_NAME);

    return {
      redis: {
        host,
        port,
      },
    };
  }
}
