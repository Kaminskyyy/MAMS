export const DATABASE_CONFIG_NAME = 'database';

export interface DatabaseConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
  synchronize: boolean;
}

export default (): { [DATABASE_CONFIG_NAME]: DatabaseConfig } => {
  const username = process.env.POSTGRES_USER || 'admin';
  const password = process.env.POSTGRES_PASSWORD || 'admin';
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = parseInt(process.env.POSTGRES_PORT) || 6000;
  const database = process.env.POSTGRES_DATABASE_NAME || 'auction';
  const synchronize = Boolean(process.env.TYPE_ORM_SYNCHRONIZE) || false;

  return {
    [DATABASE_CONFIG_NAME]: {
      username,
      password,
      host,
      port,
      database,
      synchronize,
    },
  };
};
