export const REDIS_CONFIG_NAME = 'redis';

export interface RedisConfig {
  host: string;
  port: number;
}

export default (): { [REDIS_CONFIG_NAME]: RedisConfig } => {
  const host = process.env.REDIS_HOST || 'localhost';
  const port = parseInt(process.env.REDIS_PORT) || 6379;

  return {
    [REDIS_CONFIG_NAME]: {
      host,
      port,
    },
  };
};
