import { config } from 'dotenv';
import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
/**
 * DB configuration
 */
config();
let ssl;
if (process.env.DB_SSL === 'true') {
    ssl = {
        rejectUnauthorized: false
    };
} else { ssl = false; }

const dbConfig: ConnectionOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl,
    entities: [join('build/', '**/', '*.entity.{ts,js}')],
    migrations: [join('build/', '**/', 'migrations/*.{ts,js}')],
    subscribers: ['subscriber/*.js', 'subscriber/*.ts'],
    cli: {
        migrationsDir: join('./src/database/migrations/'),
        subscribersDir: 'server/subscriber'
    },
    maxQueryExecutionTime: 5000
    , logging: ['error']
};

export default dbConfig;
