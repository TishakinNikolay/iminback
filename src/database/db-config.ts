import { ConnectionOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
/**
 * DB configuration
 */
config();
let ssl
if (process.env.DB_SSL === 'true') {
    ssl = {
        rejectUnauthorized: false
    }
} else { ssl = false }

const dbConfig: ConnectionOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl,
    entities: [join('build/', '**/', '*.entity.{ts,js}')],
    synchronize: process.env.DB_KEEP_SYNC === 'true',
    migrations: ['migration/*.js', 'migration/*.ts'],
    subscribers: ['subscriber/*.js', 'subscriber/*.ts'],
    cli: {
        migrationsDir: 'migration',
        subscribersDir: 'server/subscriber'
    },
    maxQueryExecutionTime: 5000
    , logging: ['error']
}

export default dbConfig
