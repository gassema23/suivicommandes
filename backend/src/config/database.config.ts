import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration pour NestJS (TypeOrmModuleOptions)
export const getDatabaseConfig = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/../**/*.subscriber{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  //logging:
  //  process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  migrationsRun: process.env.NODE_ENV === 'development' ? true : false, // Ne pas auto-run en production
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  extra: {
    // Configuration de pool de connexions
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
});

// Instance DataSource pour les migrations et CLI
const AppDataSource = new DataSource(getDatabaseConfig());

// Export par défaut pour TypeORM CLI
export default AppDataSource;

// Export nommé pour utilisation dans l'app
export { AppDataSource };

// Configuration pour NestJS module
export const DatabaseConfig = getDatabaseConfig();
