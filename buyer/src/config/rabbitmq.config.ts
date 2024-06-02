export const RABBITMQ_CONFIG_NAME = 'rabbitmq';

export interface RabbitMQConfig {
  url: string;
  sellerQueue: string;
  buyerQueue: string;
}

export default () => {
  const user = process.env.RABBITMQ_USER || 'admin';
  const password = process.env.RABBITMQ_PASSWORD || 'admin';
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = parseInt(process.env.RABBITMQ_PORT) || 5672;
  const sellerQueue = process.env.RABBITMQ_SELLER_QUEUE || 'auction';
  const buyerQueue = process.env.RABBITMQ_BUYER_QUEUE || 'auction';

  return {
    [RABBITMQ_CONFIG_NAME]: {
      url: `amqp://${user}:${password}@${host}:${port}`,
      sellerQueue,
      buyerQueue,
    },
  };
};
