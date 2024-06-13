export const RABBITMQ_CONFIG_NAME = 'rabbitmq';

export interface RabbitMQConfig {
  url: string;
  sellerQueue: string;
  auctionQueue: string;
}

export default (): { [RABBITMQ_CONFIG_NAME]: RabbitMQConfig } => {
  const user = process.env.RABBITMQ_USER || 'admin';
  const password = process.env.RABBITMQ_PASSWORD || 'admin';
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = parseInt(process.env.RABBITMQ_PORT) || 5672;
  const sellerQueue = process.env.RABBITMQ_SELLER_QUEUE || 'seller_queue';
  const auctionQueue = process.env.RABBITMQ_AUCTION_QUEUE || 'auction_queue';

  return {
    [RABBITMQ_CONFIG_NAME]: {
      url: `amqp://${user}:${password}@${host}:${port}`,
      sellerQueue,
      auctionQueue,
    },
  };
};
