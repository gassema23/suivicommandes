import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const DatabaseConfig: PostgresConnectionOptions = {
    type: 'postgres',
    port: parseInt(process.env.DB_PORT || '5442', 10),
    url: process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5442/suivi_commande_dev',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
}