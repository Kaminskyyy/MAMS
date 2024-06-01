export const DATABASE_CONFIG_NAME = 'database';

export interface DatabaseConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
  synchronize: boolean;
}

export default () => {
  return {
    [DATABASE_CONFIG_NAME]: {
      username: process.env.POSTGRES_USER || 'admin',
      password: process.env.POSTGRES_PASSWORD || 'admin',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT) || 6000,
      database: process.env.POSTGRES_DATABASE_NAME || 'notifications-app',
      synchronize: Boolean(process.env.TYPE_ORM_SYNCHRONIZE) || false,
    },
  };
};
