import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration de la source de données pour TypeORM.
 * Utilise les variables d'environnement pour configurer la connexion à la base de données PostgreSQL.
 * @returns {DataSourceOptions} Les options de configuration pour TypeORM.
 */
export const getDatabaseConfig = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT
    ? parseInt(process.env.POSTGRES_PORT, 10)
    : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/../**/*.subscriber{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  migrationsRun: process.env.NODE_ENV === 'development' ? true : false,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  extra: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
});

const AppDataSource = new DataSource(getDatabaseConfig());

export default AppDataSource;

export { AppDataSource };

export const DatabaseConfig = getDatabaseConfig();
